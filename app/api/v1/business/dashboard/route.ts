import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const GET = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        // Get business info
        const businessDoc = await db.collection('business').findOne(
            { _id: new ObjectId(user.userId) },
            { projection: { name: 1, email: 1, description: 1, logo: 1, phone: 1, address: 1 } }
        );
        const business = businessDoc ? { ...businessDoc, id: businessDoc._id.toString(), _id: undefined } : null;

        // Get total products
        const totalProducts = await db.collection('product').countDocuments({ businessId: user.userId });

        // Get active products
        const activeProducts = await db.collection('product').countDocuments({
            businessId: user.userId,
            isActive: true,
        });

        const businessProducts = await db.collection('product').find({ businessId: user.userId }).toArray();
        const businessProductIds = businessProducts.map((p) => p._id.toString());

        // Get total orders (orders containing business products)
        const orders = await db.collection('order').find({
             "items.productId": { $in: businessProductIds }
        }).sort({ createdAt: -1 }).toArray();

        // Calculate total revenue and top sales
        let totalRevenue = 0;
        const productSales: Record<string, number> = {};
        
        // Only count items belonging to THIS business
        orders.forEach(order => {
            order.items.forEach((item: any) => {
                 if (businessProductIds.includes(item.productId)) {
                     totalRevenue += item.price * item.quantity;
                     productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
                 }
            });
        });

        const topProductIds = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id]) => id);

        const topProducts = businessProducts
            .filter(p => topProductIds.includes(p._id.toString()))
            .map(p => ({
                id: p._id.toString(),
                name: p.name,
                price: p.price,
                images: p.images,
                totalSales: productSales[p._id.toString()] || 0
            }))
            .sort((a, b) => b.totalSales - a.totalSales);

        const recentOrders = orders.slice(0, 10).map(o => ({ ...o, id: o._id.toString(), _id: undefined }));

        return successResponse({
            business,
            stats: {
                totalProducts,
                activeProducts,
                totalOrders: orders.length,
                totalRevenue,
            },
            recentOrders,
            topProducts,
        });
    } catch (error) {
        return handleRouteError(error);
    }
});
