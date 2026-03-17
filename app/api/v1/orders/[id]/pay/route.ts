import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

// PUT /api/v1/orders/[id]/pay
export const PUT = requireAuth(async (request: NextRequest, user, { params }: any) => {
    try {
        const { id } = await params;
        
        // Find the order to ensure it exists and belongs to the user
        const order = await db.collection('order').findOne({ 
            _id: new ObjectId(id), 
            userId: user.userId 
        });

        if (!order) {
            return Errors.notFound('Order');
        }

        // Ideally, in production, we should receive the FedaPay transaction ID here
        // and verify it with the FedaPay API before marking as PAID.
        // For now, we trust the client's success callback.
        
        await db.collection('order').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'PAID', updatedAt: new Date() } }
        );

        return successResponse(null, 'Order marked as paid successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});
