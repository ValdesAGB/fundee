import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/errors';

export const GET = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        const { searchParams } = new URL(request.url);
        const rawPeriod = parseInt(searchParams.get('period') || '30', 10);
        // Clamp between 1 and 365 days to prevent abusive queries
        const days = Number.isFinite(rawPeriod) && rawPeriod > 0 ? Math.min(rawPeriod, 365) : 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch products of this business
        const products = await db.collection('product').find({ businessId: user.userId }, { projection: { _id: 1, name: 1 } }).toArray();
        const productIds = products.map(p => p._id.toString());
        const productMap = new Map(products.map(p => [p._id.toString(), { id: p._id.toString(), name: p.name }]));

        // Get orders containing business products
        const pipeline = [
            { $match: { 'items.productId': { $in: productIds }, createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            { $match: { 'items.productId': { $in: productIds } } }
        ];

        const unwoundOrders = await db.collection('order').aggregate(pipeline).toArray();

        const orderItems = unwoundOrders.map(order => ({
            ...order.items,
            createdAt: order.createdAt,
            orderId: order._id.toString(),
            order: { status: order.status },
            product: productMap.get(order.items.productId)
        }));

        // Calculate total revenue
        const totalRevenue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Calculate total orders
        const totalOrders = new Set(orderItems.map(item => item.orderId)).size;

        // Group by date
        const revenueByDate = orderItems.reduce((acc, item) => {
            const date = item.createdAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + (item.price * item.quantity);
            return acc;
        }, {} as Record<string, number>);

        // Group by status — deduplicate by orderId first to count orders not items
        const uniqueOrders = new Map<string, typeof orderItems[0]['order']>();
        for (const item of orderItems) {
            if (!uniqueOrders.has(item.orderId)) {
                uniqueOrders.set(item.orderId, item.order);
            }
        }
        const ordersByStatus = [...uniqueOrders.values()].reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return successResponse({
            period: days,
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            revenueByDate,
            ordersByStatus,
        });
    } catch (error) {
        return handleRouteError(error);
    }
});
