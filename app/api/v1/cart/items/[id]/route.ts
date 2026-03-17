import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, updateCartItemSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const PUT = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;
        const validation = await validateBody(request, updateCartItemSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { quantity } = validation.data;

        // Find cart item
        let cartItem;
        try {
            cartItem = await db.collection('cartItem').findOne({ _id: new ObjectId(id) });
        } catch {
             return Errors.notFound('Cart item');
        }

        if (!cartItem || cartItem.userId !== user.userId) {
            return Errors.notFound('Cart item');
        }

        const product = await db.collection('product').findOne({ _id: new ObjectId(cartItem.productId) });

        if (!product) {
             return Errors.notFound('Product not found for that cart item');
        }

        // Check stock
        if (product.stock < quantity) {
            return Errors.badRequest('Insufficient stock');
        }

        // Update quantity
        await db.collection('cartItem').updateOne(
            { _id: cartItem._id },
            { $set: { quantity, updatedAt: new Date() } }
        );

        const updatedItem = {
             ...cartItem,
             id: cartItem._id.toString(),
             _id: undefined,
             quantity,
             product: { ...product, id: product._id.toString(), _id: undefined }
        };

        return successResponse(updatedItem, 'Cart item updated');
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

        // Find and verify ownership
        let cartItem;
        try {
            cartItem = await db.collection('cartItem').findOne({ _id: new ObjectId(id) });
        } catch {
            return Errors.notFound('Cart item');
        }

        if (!cartItem || cartItem.userId !== user.userId) {
            return Errors.notFound('Cart item');
        }

        // Delete item
        await db.collection('cartItem').deleteOne({ _id: cartItem._id });

        return successResponse(null, 'Item removed from cart');
    } catch (error) {
        return handleRouteError(error);
    }
});
