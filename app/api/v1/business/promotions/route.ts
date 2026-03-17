import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { validateBody, createPromotionSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const GET = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        const promotions = await db.collection('promotion')
            .find({ businessId: user.userId })
            .sort({ createdAt: -1 })
            .toArray();

        // Populate corresponding products
        const populatedPromotions = await Promise.all(promotions.map(async (promotion) => {
            const productIds = (promotion.productIds || []).map((id: string) => {
                try { return new ObjectId(id); } catch { return null; }
            }).filter((id: any) => id !== null);

            const products = await db.collection('product').find({ _id: { $in: productIds } }).toArray();
            
            const mappedProducts = products.map(p => ({
                id: p._id.toString(),
                name: p.name,
                price: p.price,
                images: p.images
            }));

            return {
                ...promotion,
                id: promotion._id.toString(),
                _id: undefined,
                products: mappedProducts
            };
        }));

        return successResponse(populatedPromotions);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const POST = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, createPromotionSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { title, description, discountPercent, discountAmount, startDate, endDate, productIds } = validation.data;

        // Verify all products belong to this business
        const productObjectIds = productIds.map((id: string) => {
             try { return new ObjectId(id); } catch { return null; }
        }).filter((id: any): id is ObjectId => id !== null);

        const products = await db.collection('product').find({
            _id: { $in: productObjectIds },
            businessId: user.userId,
        }).toArray();

        if (products.length !== productIds.length) {
            return Errors.badRequest('Some products do not belong to your business');
        }

        // Create promotion
        const promotionData = {
            title,
            description,
            discountPercent,
            discountAmount,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            businessId: user.userId,
            productIds,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('promotion').insertOne(promotionData);

        const mappedProducts = products.map(p => ({
            ...p,
            id: p._id.toString(),
            _id: undefined
        }));

        const promotion = {
            ...promotionData,
            id: result.insertedId.toString(),
            _id: undefined,
            products: mappedProducts
        };

        return successResponse(promotion, 'Promotion created successfully', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});
