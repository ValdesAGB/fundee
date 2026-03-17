import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/lib/middleware';
import { validateBody, createProductSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const products = await db.collection('product').aggregate([
            { $match: { businessId: user.userId } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'category',
                    let: { categoryId: '$categoryId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        // ✅ Cas nouveau : categoryId est un ObjectId string (24 chars)
                                        { $eq: ['$_id', { $convert: { input: '$$categoryId', to: 'objectId', onError: null, onNull: null } }] },
                                        // ✅ Cas ancien : categoryId est un slug ou nom
                                        { $eq: ['$slug', '$$categoryId'] },
                                        { $eq: ['$name', '$$categoryId'] },
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, id: { $toString: '$_id' }, name: 1 } }
                    ],
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'review',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: 'orderItem',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$productId', '$$pid'] } } }
                    ],
                    as: 'orderItems'
                }
            },
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    _count: {
                        reviews: { $size: '$reviews' },
                        orderItems: { $size: '$orderItems' }
                    },
                    averageRating: { $avg: '$reviews.rating' }
                }
            },
            { $project: { _id: 0, reviews: 0, orderItems: 0 } }
        ]).toArray();

        const productsWithStats = products.map(p => ({
            ...p,
            averageRating: p.averageRating || 0
        }));

        return successResponse(productsWithStats);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, createProductSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { name, description, price, compareAtPrice, stock, categoryId, images } = validation.data;

        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const slug = `${baseSlug}-${uniqueSuffix}`;

        const productData = {
            name,
            slug,
            description,
            price,
            compareAtPrice: compareAtPrice && compareAtPrice > 0 ? compareAtPrice : null,
            stock,
            categoryId,
            businessId: user.userId,
            images: images || [],
            isActive: true,
            viewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('product').insertOne(productData);

        let category = null;
        try {
            const cat = await db.collection('category').findOne({ _id: new ObjectId(categoryId) });
            if (cat) category = { ...cat, id: cat._id.toString(), _id: undefined };
        } catch { /* ignore */ }

        const product = {
            ...productData,
            id: result.insertedId.toString(),
            category
        };

        return successResponse(product, 'Product created successfully', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});