import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/errors';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const query: any = { userId: user.userId };
        if (unreadOnly) {
            query.isRead = false;
        }

        const notifications = await db.collection('notification').find(query).sort({ createdAt: -1 }).toArray();

        // format _id to id
        const formattedNotifications = notifications.map((n: any) => {
            const formatted = { ...n, id: n._id.toString() };
            delete formatted._id;
            return formatted;
        });

        const unreadCount = await db.collection('notification').countDocuments({
            userId: user.userId,
            isRead: false,
        });

        return successResponse({
            notifications: formattedNotifications,
            unreadCount,
        });
    } catch (error) {
        return handleRouteError(error);
    }
});
