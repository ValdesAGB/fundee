import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { validateBody, updatePromotionSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const PUT = requireBusinessAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;
        const validation = await validateBody(request, updatePromotionSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return Errors.notFound('Promotion');
        }

        // Find promotion and verify ownership
        const promotion = await db.collection('promotion').findOne({ _id: objectId });

        if (!promotion) {
            return Errors.notFound('Promotion');
        }

        if (promotion.businessId !== user.userId) {
            return Errors.forbidden();
        }

        const { productIds, startDate, endDate, ...otherData } = validation.data;

        const updateData: any = { ...otherData, updatedAt: new Date() };
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (productIds) updateData.productIds = productIds; // Native representation of relations

        // Update promotion
        await db.collection('promotion').updateOne(
            { _id: objectId },
            { $set: updateData }
        );

        // Fetch the updated promotion
        const updatedPromotion = await db.collection('promotion').findOne({ _id: objectId });
        
        // Emulate include products
        let products: any[] = [];
        if (updatedPromotion && updatedPromotion.productIds && Array.isArray(updatedPromotion.productIds)) {
             const productObjIds = updatedPromotion.productIds.filter((pid: string) => ObjectId.isValid(pid)).map((pid: string) => new ObjectId(pid));
             products = await db.collection('product').find({ _id: { $in: productObjIds } }).toArray();
             products = products.map(p => ({ ...p, id: p._id.toString(), _id: undefined }));
        }

        const formattedPromotion = {
             ...updatedPromotion,
             id: updatedPromotion?._id?.toString(),
             _id: undefined,
             products
        };

        return successResponse(formattedPromotion, 'Promotion updated successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});

export const DELETE = requireBusinessAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return Errors.notFound('Promotion');
        }

        // Find promotion and verify ownership
        const promotion = await db.collection('promotion').findOne({ _id: objectId });

        if (!promotion) {
            return Errors.notFound('Promotion');
        }

        if (promotion.businessId !== user.userId) {
            return Errors.forbidden();
        }

        // Delete promotion
        await db.collection('promotion').deleteOne({ _id: objectId });

        return successResponse(null, 'Promotion deleted successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});
