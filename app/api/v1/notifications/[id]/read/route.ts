import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const PUT = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        // Find notification and verify ownership
        const notification = await db.collection('notification').findOne({ _id: new ObjectId(id) });

        if (!notification) {
            return Errors.notFound('Notification');
        }

        if (notification.userId !== user.userId) {
            return Errors.forbidden();
        }

        // Mark as read
        await db.collection('notification').updateOne(
            { _id: notification._id },
            { $set: { isRead: true, updatedAt: new Date() } }
        );

        const updatedNotification = {
             ...notification,
             isRead: true,
             id: notification._id.toString(),
             _id: undefined
        };

        return successResponse(updatedNotification, 'Notification marked as read');
    } catch (error) {
        return handleRouteError(error);
    }
});
