import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const cartItems = await db.collection('cartItem').aggregate([
            { $match: { userId: user.userId } },
            {
                $lookup: {
                    from: 'product',
                    let: { productId: { $toObjectId: '$productId' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                        {
                            $lookup: {
                                from: 'category',
                                let: { categoryId: { $toObjectId: '$categoryId' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1 } }
                                ],
                                as: 'category'
                            }
                        },
                        {
                            $lookup: {
                                from: 'business',
                                let: { businessId: { $toObjectId: '$businessId' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$businessId'] } } },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1 } }
                                ],
                                as: 'business'
                            }
                        },
                        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
                        { $addFields: { id: { $toString: '$_id' } } },
                        { $project: { _id: 0 } }
                    ],
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            { $addFields: { id: { $toString: '$_id' } } },
            { $project: { _id: 0 } }
        ]).toArray();

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return successResponse({
            items: cartItems,
            subtotal,
            itemCount,
        });
    } catch (error) {
        return handleRouteError(error);
    }
});

export const DELETE = requireAuth(async (request: NextRequest, user) => {
    try {
        await db.collection('cartItem').deleteMany({
            userId: user.userId,
        });

        return successResponse(null, 'Cart cleared successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});
