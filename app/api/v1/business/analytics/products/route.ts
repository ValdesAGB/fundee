import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const GET = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        const products = await db.collection('product').find({ businessId: user.userId }).toArray();
        const productIds = products.map((p) => p._id.toString());

        // We need orderItems for revenue. Since orders embed items, we query orders
        const orders = await db.collection('order').find({
             "items.productId": { $in: productIds }
        }).toArray();
        
        // Aggregate reviews per product
        const reviews = await db.collection('review').find({ productId: { $in: productIds } }).toArray();
        // Aggregate favorites per product
        const favorites = await db.collection('favorite').find({ productId: { $in: productIds } }).toArray();

        // Calculate stats for each product
        const productsWithStats = products.map((product) => {
            const pIdStr = product._id.toString();
            
            // Calculate sales & revenue
            let totalSold = 0;
            let revenue = 0;
            orders.forEach(order => {
                order.items.forEach((item: any) => {
                     if (item.productId === pIdStr) {
                         totalSold += item.quantity;
                         revenue += item.quantity * item.price;
                     }
                });
            });

            // Calculate reviews
            const pReviews = reviews.filter(r => r.productId === pIdStr);
            const reviewCount = pReviews.length;
            const averageRating = reviewCount > 0 
                ? pReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
                : 0;

            // Favorites count
            const favoritesCount = favorites.filter(f => f.productId === pIdStr).length;

            return {
                id: pIdStr,
                name: product.name,
                price: product.price,
                stock: product.stock,
                viewCount: product.viewCount,
                _count: {
                    orderItems: totalSold,
                    reviews: reviewCount,
                    favorites: favoritesCount,
                },
                totalSold,
                revenue,
                averageRating,
                reviewCount,
            };
        });

        // Sort by revenue
        productsWithStats.sort((a, b) => b.revenue - a.revenue);

        return successResponse(productsWithStats);
    } catch (error) {
        return handleRouteError(error);
    }
});
