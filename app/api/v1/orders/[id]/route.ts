import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const GET = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        // Native mongodb returns the order with items embedded
        let order;
        try {
            order = await db.collection('order').findOne({ _id: new ObjectId(id) });
        } catch {
            return Errors.notFound('Order');
        }

        if (!order) {
            return Errors.notFound('Order');
        }

        // Verify ownership
        if (order.userId !== user.userId) {
            return Errors.forbidden();
        }

        // Embed business data into product for each item
        const populatedItems = await Promise.all(order.items.map(async (item: any) => {
             if (item.productId) {
                  const productFull = await db.collection('product').findOne({ _id: new ObjectId(item.productId) });
                  if (productFull && productFull.businessId) {
                       const business = await db.collection('business').findOne({ _id: new ObjectId(productFull.businessId) });
                       if (business) {
                            item.product.business = { id: business._id.toString(), name: business.name, logo: business.logo };
                       }
                  }
             }
             return item;
        }));

        const result = {
            ...order,
            id: order._id.toString(),
            _id: undefined,
            items: populatedItems
        };

        return successResponse(result);
    } catch (error) {
        return handleRouteError(error);
    }
});
