import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/lib/middleware';
import { validateBody, addToCartSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, addToCartSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { productId, quantity } = validation.data;

        // Check if product exists and is active
        let product;
        try {
            product = await db.collection('product').findOne({ _id: new ObjectId(productId) });
        } catch {
             return Errors.notFound('Product');
        }

        if (!product || !product.isActive) {
            return Errors.notFound('Product');
        }

        // Check stock
        if (product.stock < (quantity ?? 1)) {
            return Errors.badRequest('Insufficient stock');
        }

        // Check if item already in cart
        const existingItem = await db.collection('cartItem').findOne({
            userId: user.userId,
            productId,
        });

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            await db.collection('cartItem').updateOne(
                { _id: existingItem._id },
                { $set: { quantity: newQuantity, updatedAt: new Date() } }
            );

            return successResponse({
                id: existingItem._id.toString(),
                userId: existingItem.userId,
                productId: existingItem.productId,
                quantity: newQuantity,
                product: { ...product, id: product._id.toString(), _id: undefined }
            }, 'Cart updated successfully');
        }

        // Create new cart item
        const itemData = {
            userId: user.userId,
            productId,
            quantity,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('cartItem').insertOne(itemData);

        const cartItem = {
            ...itemData,
            id: result.insertedId.toString(),
            product: { ...product, id: product._id.toString(), _id: undefined }
        };

        return successResponse(cartItem, 'Product added to cart', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});
