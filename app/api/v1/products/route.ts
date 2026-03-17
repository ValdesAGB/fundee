import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const categoryId = searchParams.get('categoryId') || undefined;
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
        const search = searchParams.get('search') || undefined;
        const sortBy = searchParams.get('sortBy') || 'newest';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

        // Build where clause
        const query: any = { isActive: true };

        if (categoryId) {
            query.categoryId = categoryId;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = minPrice;
            if (maxPrice !== undefined) query.price.$lte = maxPrice;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort clause
        let sortOpt: any = { createdAt: -1 };
        switch (sortBy) {
            case 'price_asc': sortOpt = { price: 1 }; break;
            case 'price_desc': sortOpt = { price: -1 }; break;
            case 'name_asc': sortOpt = { name: 1 }; break;
            case 'name_desc': sortOpt = { name: -1 }; break;
            case 'popular': sortOpt = { viewCount: -1 }; break;
            case 'newest':
            default: sortOpt = { createdAt: -1 }; break;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        const pipeline = [
            { $match: query },
            { $sort: sortOpt },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'category',
                                let: { catId: { $toObjectId: '$categoryId' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$catId'] } } },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, slug: 1 } }
                                ],
                                as: 'category'
                            }
                        },
                        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'business',
                                let: { busId: { $toObjectId: '$businessId' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$busId'] } } },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, logo: 1 } }
                                ],
                                as: 'business'
                            }
                        },
                        { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'review',
                                let: { pid: { $toString: '$_id' } },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$productId', '$$pid'] } } }
                                ],
                                as: 'reviews'
                            }
                        },
                        {
                            $addFields: {
                                id: { $toString: '$_id' },
                                reviewCount: { $size: '$reviews' },
                                averageRating: { $avg: '$reviews.rating' }
                            }
                        },
                        { $project: { _id: 0, reviews: 0 } }
                    ]
                }
            }
        ];

        // Execute query
        const result = await db.collection('product').aggregate(pipeline).toArray();
        const facetResult = result[0];
        
        const total = facetResult.metadata[0]?.total || 0;
        const productsWithRatings = facetResult.data.map((p: any) => ({
            ...p,
            averageRating: p.averageRating || 0
        }));

        return successResponse({
            products: productsWithRatings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleRouteError(error);
    }
}
