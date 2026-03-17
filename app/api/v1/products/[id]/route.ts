import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export async function GET(
    request: NextRequest,
    { params }: any
) {
    try {
        const { id } = await params;

        // Increment view count directly
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return Errors.notFound('Product');
        }

        await db.collection('product').updateOne(
            { _id: objectId },
            { $inc: { viewCount: 1 } }
        );

        const productArray = await db.collection('product').aggregate([
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: 'category',
                    let: { categoryId: { $toObjectId: '$categoryId' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
                        { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, slug: 1 } }
                    ],
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'business',
                    let: { businessId: { $toObjectId: '$businessId' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$businessId'] } } },
                        { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, logo: 1, description: 1 } }
                    ],
                    as: 'business'
                }
            },
            { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'promotion',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$productId', '$$pid'] },
                                isActive: true,
                                startDate: { $lte: new Date() },
                                endDate: { $gte: new Date() }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                id: { $toString: '$_id' },
                                title: 1,
                                description: 1,
                                discountPercent: 1,
                                discountAmount: 1,
                                endDate: 1
                            }
                        }
                    ],
                    as: 'promotions'
                }
            },
            {
                $lookup: {
                    from: 'review',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$productId', '$$pid'] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 10 },
                        {
                            $lookup: {
                                from: 'user',
                                let: { uid: { $toObjectId: '$userId' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, firstName: 1, lastName: 1, image: 1 } }
                                ],
                                as: 'user'
                            }
                        },
                        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                        { $addFields: { id: { $toString: '$_id' } } },
                        { $project: { _id: 0 } }
                    ],
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: 'review',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$productId', '$$pid'] } } }
                    ],
                    as: 'allReviews'
                }
            },
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    averageRating: { $avg: '$allReviews.rating' },
                    reviewCount: { $size: '$allReviews' }
                }
            },
            { $project: { _id: 0, allReviews: 0 } }
        ]).toArray();

        const product = productArray[0];

        if (!product) {
            return Errors.notFound('Product');
        }

        // Handle possible null average rating
        product.averageRating = product.averageRating || 0;

        return successResponse(product);
    } catch (error) {
        return handleRouteError(error);
    }
}
