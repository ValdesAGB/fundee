import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, createOrderSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';
import { initFedaPay, Transaction } from '@/lib/fedapay';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const orders = await db.collection('order')
            .find({ userId: user.userId })
            .sort({ createdAt: -1 })
            .toArray();

        // Items are embedded within the order document in native MongoDB
        const formatted = orders.map(o => ({
             ...o,
             id: o._id.toString(),
             _id: undefined
        }));

        return successResponse(formatted);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, createOrderSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { shippingAddress, shippingPhone, notes } = validation.data;

        // Get user's cart
        interface CartItem {
            _id: ObjectId;
            userId: string;
            productId: string;
            quantity: number;
        }
        const cartItems = await db.collection<CartItem>('cartItem').find({ userId: user.userId }).toArray();

        if (cartItems.length === 0) {
            return Errors.badRequest('Cart is empty');
        }

        // Fetch populated products
        const populatedCartItems = await Promise.all(cartItems.map(async item => {
            const product = await db.collection('product').findOne({ _id: new ObjectId(item.productId) });
            return {
                ...item,
                product: product ? { id: product._id.toString(), name: product.name, price: product.price, images: product.images, stock: product.stock } : null
            };
        }));

        // Verify stock availability
        for (const item of populatedCartItems) {
            if (!item.product) {
                 return Errors.badRequest(`Product not found for item ${item.productId}`);
            }
            if (item.product.stock < item.quantity) {
                 return Errors.badRequest(`Insufficient stock for ${item.product.name}`);
            }
        }

        // Calculate totals
        const subtotal = populatedCartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax (adjust as needed)
        const total = subtotal + tax;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Decrement stock sequentially
        for (const item of populatedCartItems) {
            const result = await db.collection('product').findOneAndUpdate(
                { _id: new ObjectId(item.productId), stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity }, $set: { updatedAt: new Date() } }
            );
            if (!result) {
                // Since this isn't atomic across multiple products, previous products are already decremented.
                // In production with replica set, a session transaction is recommended!
                // For standalone dev we throw an error.
                throw new Error(`STOCK_INSUFFICIENT:${item.product!.name}`);
            }
        }

        // Create order
        const newOrder = {
            userId: user.userId,
            orderNumber,
            status: 'PENDING',
            subtotal,
            tax,
            total,
            shippingAddress,
            shippingPhone,
            notes,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: populatedCartItems.map((item) => ({
                id: new ObjectId().toString(),
                productId: item.productId,
                quantity: item.quantity,
                price: item.product!.price,
                product: { id: item.product!.id, name: item.product!.name, images: item.product!.images }
            }))
        };

        const insertRes = await db.collection('order').insertOne(newOrder);
        const orderId = insertRes.insertedId.toString();

        // --- FedaPay Payment Integration ---
        let paymentUrl = '';
        try {
            initFedaPay();
            
            // Get full user profile for FedaPay customer details
            const userProfile = await db.collection('user').findOne({ id: user.userId });

            const transaction = await Transaction.create({
                description: `Payment for Order ${orderNumber}`,
                amount: Math.round(total),
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/payments/callback?orderId=${orderId}`,
                currency: {
                    iso: 'XOF'
                },
                customer: {
                    firstname: userProfile?.firstName || user.email.split('@')[0],
                    lastname: userProfile?.lastName || 'Customer',
                    email: user.email,
                    phone_number: {
                        number: userProfile?.phone || '00000000',
                        country: 'BJ' // Default to Benin as per user example
                    }
                }
            });

            paymentUrl = transaction.url;
            
            // Update order with transaction info
            await db.collection('order').updateOne(
                { _id: insertRes.insertedId },
                { $set: { fedapayTransactionId: transaction.id, paymentUrl } }
            );
        } catch (paymentError) {
            console.error('FedaPay transaction creation failed:', paymentError);
            // We don't fail the whole order creation if payment initiation fails, 
            // but we might want to inform the user or handle it.
        }
        
        // Clear cart
        await db.collection('cartItem').deleteMany({ userId: user.userId });

        return successResponse({ 
            ...newOrder, 
            id: orderId,
            paymentUrl 
        }, 'Order created successfully. Please complete payment.', 201);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('STOCK_INSUFFICIENT:')) {
            const productName = error.message.split(':')[1];
            return Errors.badRequest(`Insufficient stock for ${productName}`);
        }
        return handleRouteError(error);
    }
});
