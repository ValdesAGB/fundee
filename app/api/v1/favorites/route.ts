import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { z } from 'zod';
import { validateBody } from '@/lib/validation';
import { ObjectId } from 'mongodb';

const addFavoriteSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
});

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const favorites = await db.collection('favorite')
            .find({ userId: user.userId })
            .sort({ createdAt: -1 })
            .toArray();

        const populatedFavorites = await Promise.all(favorites.map(async (f) => {
            let product = null;
            if (f.productId) {
                const p = await db.collection('product').findOne({ _id: new ObjectId(f.productId) });
                if (p) {
                    product = { ...p, id: p._id.toString(), _id: undefined } as any;
                    
                    if (p.categoryId) {
                        const cat = await db.collection('category').findOne({ _id: new ObjectId(p.categoryId) });
                        if (cat) product.category = { id: cat._id.toString(), name: cat.name };
                    }
                    if (p.businessId) {
                        const bus = await db.collection('business').findOne({ _id: new ObjectId(p.businessId) });
                        if (bus) product.business = { id: bus._id.toString(), name: bus.name };
                    }
                }
            }

            return {
                ...f,
                id: f._id.toString(),
                _id: undefined,
                product
            };
        }));

        return successResponse(populatedFavorites);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, addFavoriteSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { productId } = validation.data;

        // Check if product exists
        let product;
        try {
            product = await db.collection('product').findOne({ _id: new ObjectId(productId) });
        } catch {
            return Errors.notFound('Product');
        }

        if (!product) {
            return Errors.notFound('Product');
        }

        // Check if already favorited
        const existing = await db.collection('favorite').findOne({
            userId: user.userId,
            productId,
        });

        if (existing) {
            return Errors.conflict('Product already in favorites');
        }

        // Add to favorites
        const favoriteData = {
            userId: user.userId,
            productId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('favorite').insertOne(favoriteData);

        const favorite = {
            ...favoriteData,
            id: result.insertedId.toString(),
            product: { ...product, id: product._id.toString(), _id: undefined }
        };

        return successResponse(favorite, 'Added to favorites', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});
