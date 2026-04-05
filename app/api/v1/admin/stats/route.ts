import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/middleware";
import { successResponse, handleRouteError } from "@/lib/errors";

/**
 * GET /api/v1/admin/stats
 *
 * Returns platform-wide statistics for the admin dashboard.
 * Protected: ADMIN role required.
 *
 * Query params:
 *   - period  {number}  Number of days to look back for trends (default: 30, max: 365)
 */
export const GET = requireRole("ADMIN", async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawPeriod = parseInt(searchParams.get("period") || "30", 10);
    const days =
      Number.isFinite(rawPeriod) && rawPeriod > 0
        ? Math.min(rawPeriod, 365)
        : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ── 1. Users ──────────────────────────────────────────────────────────
    const [totalUsers, newUsers] = await Promise.all([
      db.collection("user").countDocuments(),
      db.collection("user").countDocuments({ createdAt: { $gte: startDate } }),
    ]);

    // ── 2. Businesses ─────────────────────────────────────────────────────
    const [totalBusinesses, newBusinesses, activeBusinesses] =
      await Promise.all([
        db.collection("business").countDocuments(),
        db
          .collection("business")
          .countDocuments({ createdAt: { $gte: startDate } }),
        db.collection("business").countDocuments({ isActive: true }),
      ]);

    // ── 3. Products ───────────────────────────────────────────────────────
    const [totalProducts, activeProducts, newProducts] = await Promise.all([
      db.collection("product").countDocuments(),
      db.collection("product").countDocuments({ isActive: true }),
      db
        .collection("product")
        .countDocuments({ createdAt: { $gte: startDate } }),
    ]);

    // ── 4. Orders & Revenue ───────────────────────────────────────────────
    const ordersPipeline = [
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ];

    const [allTimeOrders, periodOrdersResult] = await Promise.all([
      db.collection("order").countDocuments(),
      db.collection("order").aggregate(ordersPipeline).toArray(),
    ]);

    const periodOrders = periodOrdersResult[0] ?? { totalRevenue: 0, count: 0 };

    // All-time revenue
    const allTimeRevenueResult = await db
      .collection("order")
      .aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }])
      .toArray();
    const allTimeRevenue = allTimeRevenueResult[0]?.total ?? 0;

    // ── 5. Orders by status ───────────────────────────────────────────────
    const ordersByStatusResult = await db
      .collection("order")
      .aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray();

    const ordersByStatus = ordersByStatusResult.reduce<Record<string, number>>(
      (acc, { _id, count }) => {
        acc[_id as string] = count;
        return acc;
      },
      {},
    );

    // ── 6. Revenue trend (grouped by day) ─────────────────────────────────
    const revenueTrendResult = await db
      .collection("order")
      .aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const revenueTrend = revenueTrendResult.map(({ _id, revenue, orders }) => ({
      date: _id,
      revenue,
      orders,
    }));

    // ── 7. Top 5 businesses by revenue ────────────────────────────────────
    const topBusinessesPipeline = [
      { $unwind: "$items" },
      {
        $lookup: {
          from: "product",
          let: { pid: "$items.productId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: "$_id" }, "$$pid"] },
              },
            },
            { $project: { _id: 0, businessId: 1 } },
          ],
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$product.businessId",
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          orders: { $addToSet: "$_id" },
        },
      },
      {
        $project: {
          businessId: "$_id",
          revenue: 1,
          orderCount: { $size: "$orders" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ];

    const topRawBusinesses = await db
      .collection("order")
      .aggregate(topBusinessesPipeline)
      .toArray();

    // Enrich with business names.
    // businessId in orders is stored as a plain string → match via $expr/$toString
    const topBusinessIds: string[] = topRawBusinesses.map(
      (b) => b.businessId as string,
    );
    const businessDocs = await db
      .collection("business")
      .aggregate([
        {
          $match: {
            $expr: { $in: [{ $toString: "$_id" }, topBusinessIds] },
          },
        },
        { $project: { _id: 1, name: 1, logo: 1 } },
      ])
      .toArray();

    const businessNameMap = new Map(
      businessDocs.map((b) => [
        b._id.toString(),
        { name: b.name, logo: b.logo },
      ]),
    );

    const topBusinesses = topRawBusinesses.map((b) => ({
      businessId: b.businessId,
      name: businessNameMap.get(b.businessId)?.name ?? "Inconnu",
      logo: businessNameMap.get(b.businessId)?.logo ?? null,
      revenue: b.revenue,
      orderCount: b.orderCount,
    }));

    // ── 8. Top 5 products by sales volume ────────────────────────────────
    const topProductsPipeline = [
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ];

    const topRawProducts = await db
      .collection("order")
      .aggregate(topProductsPipeline)
      .toArray();

    // productId in orders is a plain string → match via $expr/$toString
    const topProductIds: string[] = topRawProducts.map((p) => p._id as string);
    const productDocs = await db
      .collection("product")
      .aggregate([
        {
          $match: {
            $expr: { $in: [{ $toString: "$_id" }, topProductIds] },
          },
        },
        { $project: { _id: 1, name: 1, images: 1, price: 1 } },
      ])
      .toArray();

    const productNameMap = new Map(
      productDocs.map((p) => [
        p._id.toString(),
        { name: p.name, images: p.images, price: p.price },
      ]),
    );

    const topProducts = topRawProducts.map((p) => ({
      productId: p._id as string,
      name: productNameMap.get(p._id as string)?.name ?? "Inconnu",
      images: productNameMap.get(p._id as string)?.images ?? [],
      price: productNameMap.get(p._id as string)?.price ?? 0,
      totalSold: p.totalSold,
      revenue: p.revenue,
    }));

    // ── 9. Categories distribution ────────────────────────────────────────
    const categoryDistribution = await db
      .collection("product")
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        {
          // ✅ Cherche par slug au lieu de ObjectId
          $lookup: {
            from: "category",
            localField: "_id",
            foreignField: "slug",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            categoryId: "$_id",
            // ✅ Fallback sur l'_id si la catégorie n'est pas trouvée
            name: { $ifNull: ["$category.name", "$_id"] },
            count: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // ── Build response ────────────────────────────────────────────────────
    return successResponse({
      period: days,
      generatedAt: new Date().toISOString(),

      overview: {
        users: {
          total: totalUsers,
          newInPeriod: newUsers,
        },
        businesses: {
          total: totalBusinesses,
          active: activeBusinesses,
          newInPeriod: newBusinesses,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          newInPeriod: newProducts,
        },
        orders: {
          total: allTimeOrders,
          inPeriod: periodOrders.count,
        },
        revenue: {
          allTime: allTimeRevenue,
          inPeriod: periodOrders.totalRevenue,
          averageOrderValue:
            periodOrders.count > 0
              ? periodOrders.totalRevenue / periodOrders.count
              : 0,
        },
      },

      ordersByStatus,
      revenueTrend,
      topBusinesses,
      topProducts,
      categoryDistribution,
    });
  } catch (error) {
    return handleRouteError(error);
  }
});
