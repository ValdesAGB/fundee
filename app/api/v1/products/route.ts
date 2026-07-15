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
                                let: { catId: '$categoryId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [
                                                    { $eq: ['$_id', { $convert: { input: '$$catId', to: 'objectId', onError: null, onNull: null } }] },
                                                    { $eq: [{ $toString: '$_id' }, '$$catId'] },
                                                    { $eq: ['$slug', '$$catId'] }
                                                ]
                                            }
                                        }
                                    },
                                    { $project: { _id: 0, id: { $toString: '$_id' }, name: 1, slug: 1 } }
                                ],
                                as: 'category'
                            }
                        },
                        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'business',
                                let: { busId: '$businessId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [
                                                    // businessId stocké comme ObjectId string (24 chars hex)
                                                    { $eq: ['$_id', { $convert: { input: '$$busId', to: 'objectId', onError: null, onNull: null } }] },
                                                    // businessId stocké comme string directement
                                                    { $eq: [{ $toString: '$_id' }, '$$busId'] }
                                                ]
                                            }
                                        }
                                    },
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
                            $lookup: {
                                from: 'promotion',
                                let: { pid: { $toString: '$_id' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $in: ['$$pid', '$productIds'] },
                                                    { $eq: ['$isActive', true] },
                                                    { $lte: ['$startDate', new Date()] },
                                                    { $gte: ['$endDate', new Date()] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            id: { $toString: '$_id' },
                                            title: 1,
                                            discountPercent: 1,
                                            discountAmount: 1,
                                            endDate: 1
                                        }
                                    }
                                ],
                                as: 'activePromotions'
                            }
                        },
                        {
                            $addFields: {
                                id: { $toString: '$_id' },
                                reviewCount: { $size: '$reviews' },
                                averageRating: { $avg: '$reviews.rating' },
                                activePromotion: { $arrayElemAt: ['$activePromotions', 0] },
                                promotionalPrice: {
                                    $let: {
                                        vars: {
                                            promo: { $arrayElemAt: ['$activePromotions', 0] }
                                        },
                                        in: {
                                            $cond: {
                                                if: { $ne: ['$$promo', null] },
                                                then: {
                                                    $cond: {
                                                        if: { $ne: ['$$promo.discountPercent', null] },
                                                        then: {
                                                            $round: [
                                                                { $multiply: ['$price', { $subtract: [1, { $divide: ['$$promo.discountPercent', 100] }] }] },
                                                                0
                                                            ]
                                                        },
                                                        else: {
                                                            $cond: {
                                                                if: { $ne: ['$$promo.discountAmount', null] },
                                                                then: { $max: [{ $subtract: ['$price', '$$promo.discountAmount'] }, 0] },
                                                                else: '$price'
                                                            }
                                                        }
                                                    }
                                                },
                                                else: null
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        { $project: { _id: 0, reviews: 0, activePromotions: 0 } }
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
            averageRating: p.averageRating || 0,
            promotionalPrice: p.promotionalPrice || null,
            activePromotion: p.activePromotion || null
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
