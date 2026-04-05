import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";
import { successResponse, handleRouteError } from "@/lib/errors";

/**
 * GET /api/v1/business/stats
 *
 * Returns business-specific statistics for the business dashboard.
 * Protected: BUSINESS role required.
 *
 * Query params:
 *   - period  {number}  Number of days to look back (default: 30, max: 365)
 */
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawPeriod = parseInt(searchParams.get("period") || "30", 10);
    const days =
      Number.isFinite(rawPeriod) && rawPeriod > 0
        ? Math.min(rawPeriod, 365)
        : 30;

    const businessId = user.userId;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // ── 1. Products ───────────────────────────────────────────────────────
    const [totalProducts, activeProducts, newProducts] = await Promise.all([
      db.collection("product").countDocuments({ businessId }),
      db.collection("product").countDocuments({ businessId, isActive: true }),
      db
        .collection("product")
        .countDocuments({ businessId, createdAt: { $gte: startDate } }),
    ]);

    // Get all product IDs for this business to filter orders efficiently
    const businessProducts = await db
      .collection("product")
      .find(
        { businessId },
        { projection: { _id: 1, name: 1, images: 1, price: 1, categoryId: 1 } },
      )
      .toArray();

    const businessProductIds = businessProducts.map((p) => p._id.toString());
    const productMap = new Map(
      businessProducts.map((p) => [p._id.toString(), p]),
    );

    if (businessProductIds.length === 0) {
      return successResponse({
        period: days,
        generatedAt: new Date().toISOString(),
        overview: {
          products: { total: 0, active: 0, newInPeriod: 0 },
          orders: { total: 0, inPeriod: 0 },
          revenue: { allTime: 0, inPeriod: 0, averageOrderValue: 0 },
        },
        ordersByStatus: {},
        revenueTrend: [],
        topProducts: [],
        categoryDistribution: [],
      });
    }

    // ── 2. Orders & Revenue (Scoped to Business Products) ─────────────────

    // Pipeline to get orders containing at least one business product
    const businessOrdersPipeline = [
      { $match: { "items.productId": { $in: businessProductIds } } },
      {
        $facet: {
          allTime: [
            { $unwind: "$items" },
            { $match: { "items.productId": { $in: businessProductIds } } },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                uniqueOrders: { $addToSet: "$$ROOT._id" },
              },
            },
            {
              $project: {
                totalRevenue: 1,
                orderCount: { $size: "$uniqueOrders" },
              },
            },
          ],
          period: [
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: "$items" },
            { $match: { "items.productId": { $in: businessProductIds } } },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                uniqueOrders: { $addToSet: "$$ROOT._id" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                totalRevenue: 1,
                orderCount: { $size: "$uniqueOrders" },
              },
            },
          ],
          status: [
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],
          revenueTrend: [
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: "$items" },
            { $match: { "items.productId": { $in: businessProductIds } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                revenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                orders: { $addToSet: "$$ROOT._id" },
              },
            },
            {
              $project: {
                date: "$_id",
                revenue: 1,
                orderCount: { $size: "$orders" },
              },
            },
            { $sort: { date: 1 } },
          ],
          topProducts: [
            { $unwind: "$items" },
            { $match: { "items.productId": { $in: businessProductIds } } },
            {
              $group: {
                _id: "$items.productId",
                totalSold: { $sum: "$items.quantity" },
                revenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
              },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ];

    const [results] = await db
      .collection("order")
      .aggregate(businessOrdersPipeline)
      .toArray();

    const allTimeStats = results.allTime[0] || {
      totalRevenue: 0,
      orderCount: 0,
    };
    const periodStats = results.period[0] || { totalRevenue: 0, orderCount: 0 };

    const ordersByStatus = (results.status || []).reduce(
      (acc: any, { _id, count }: any) => {
        acc[_id] = count;
        return acc;
      },
      {},
    );

    const revenueTrend = (results.revenueTrend || []).map((t: any) => ({
      date: t.date,
      revenue: t.revenue,
      orders: t.orderCount,
    }));

    const topProducts = (results.topProducts || []).map((p: any) => {
      const product = productMap.get(p._id);
      return {
        id: p._id,
        name: product?.name || "Inconnu",
        images: product?.images || [],
        price: product?.price || 0,
        totalSold: p.totalSold,
        revenue: p.revenue,
      };
    });

    // ── 3. Category Distribution (of catalog) ───────────────────────────
    const categoryDistribution = await db
      .collection("product")
      .aggregate([
        { $match: { businessId, isActive: true } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "category",
            let: { catId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $eq: [
                          "$_id",
                          {
                            $convert: {
                              input: "$$catId",
                              to: "objectId",
                              onError: null,
                              onNull: null,
                            },
                          },
                        ],
                      },
                      { $eq: ["$slug", "$$catId"] },
                      { $eq: ["$name", "$$catId"] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1 } },
            ],
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            categoryId: "$_id",
            name: "$category.name",
            count: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    // ── 4. Final Response ───────────────────────────────────────────────
    return successResponse({
      period: days,
      generatedAt: new Date().toISOString(),
      overview: {
        products: {
          total: totalProducts,
          active: activeProducts,
          newInPeriod: newProducts,
        },
        orders: {
          total: allTimeStats.orderCount,
          inPeriod: periodStats.orderCount,
        },
        revenue: {
          allTime: allTimeStats.totalRevenue,
          inPeriod: periodStats.totalRevenue,
          averageOrderValue:
            periodStats.orderCount > 0
              ? periodStats.totalRevenue / periodStats.orderCount
              : 0,
        },
      },
      ordersByStatus,
      revenueTrend,
      topProducts,
      categoryDistribution,
    });
  } catch (error) {
    return handleRouteError(error);
  }
});
