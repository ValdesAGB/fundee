import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initFedaPay, Transaction } from '@/lib/fedapay';
import { ObjectId } from 'mongodb';

/**
 * GET /api/v1/payments/callback
 * Handles redirection from FedaPay after a payment attempt.
 * Query params: orderId, status (optional, depends on FedaPay redirect)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    try {
        initFedaPay();

        // Find the order
        const order = await db.collection('order').findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Ideally, we should verify the transaction status with FedaPay here
        // using the transaction ID we saved earlier.
        if (order.fedapayTransactionId) {
            try {
                const transaction = await Transaction.retrieve(order.fedapayTransactionId);
                
                if (transaction.status === 'approved' || transaction.status === 'transferred') {
                    await db.collection('order').updateOne(
                        { _id: new ObjectId(orderId) },
                        { $set: { status: 'PAID', updatedAt: new Date() } }
                    );
                } else if (transaction.status === 'canceled' || transaction.status === 'declined') {
                    await db.collection('order').updateOne(
                        { _id: new ObjectId(orderId) },
                        { $set: { status: 'CANCELED', updatedAt: new Date() } }
                    );
                }
            } catch (retrieveError) {
                console.error('Failed to retrieve FedaPay transaction:', retrieveError);
            }
        }

        // Redirect to a success or orders page on the frontend
        const redirectUrl = new URL('/profile', request.url); // Default to profile/orders
        return NextResponse.redirect(redirectUrl);

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
