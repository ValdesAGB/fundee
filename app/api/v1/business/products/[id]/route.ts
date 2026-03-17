import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/lib/middleware'; // ✅ changé
import { validateBody, updateProductSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const GET = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        const productArray = await db.collection('product').aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: 'category',
                    let: { categoryId: { $toObjectId: '$categoryId' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } }
                    ],
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'promotion',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$productId', '$$pid'] } } }
                    ],
                    as: 'promotions'
                }
            },
            {
                $lookup: {
                    from: 'review',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [{ $match: { $expr: { $eq: ['$productId', '$$pid'] } } }],
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: 'orderItem',
                    let: { pid: { $toString: '$_id' } },
                    pipeline: [{ $match: { $expr: { $eq: ['$productId', '$$pid'] } } }],
                    as: 'orderItems'
                }
            },
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    _count: {
                        reviews: { $size: '$reviews' },
                        orderItems: { $size: '$orderItems' }
                    }
                }
            },
            { $project: { _id: 0, reviews: 0, orderItems: 0 } }
        ]).toArray();

        if (productArray.length > 0) {
            const p = productArray[0];
            if (p.category) p.category.id = p.category._id?.toString() || p.category.id;
            p.promotions = p.promotions.map((promo: any) => ({ ...promo, id: promo._id?.toString() || promo.id }));
        }

        const product = productArray[0];

        if (!product) return Errors.notFound('Product');
        if (product.businessId !== user.userId) return Errors.forbidden();

        return successResponse(product);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const PUT = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;
        const validation = await validateBody(request, updateProductSchema);

        if (!validation.success) return Errors.validationError(validation.error);

        const product = await db.collection('product').findOne({ _id: new ObjectId(id) });

        if (!product) return Errors.notFound('Product');
        if (product.businessId !== user.userId) return Errors.forbidden();

        const updateData = { ...validation.data, updatedAt: new Date() };
        await db.collection('product').updateOne(
            { _id: product._id },
            { $set: updateData }
        );

        let category = null;
        if (updateData.categoryId || product.categoryId) {
            try {
                const catId = updateData.categoryId || product.categoryId;
                const cat = await db.collection('category').findOne({ _id: new ObjectId(catId) });
                if (cat) category = { ...cat, id: cat._id.toString(), _id: undefined };
            } catch {}
        }

        const updatedProduct = {
            ...product,
            ...updateData,
            id: product._id.toString(),
            _id: undefined,
            category
        };

        return successResponse(updatedProduct, 'Product updated successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});

export const DELETE = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        const product = await db.collection('product').findOne({ _id: new ObjectId(id) });

        if (!product) return Errors.notFound('Product');
        if (product.businessId !== user.userId) return Errors.forbidden();

        await db.collection('product').deleteOne({ _id: product._id });

        return successResponse(null, 'Product deleted successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});