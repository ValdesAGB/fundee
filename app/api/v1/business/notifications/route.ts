import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { validateBody, createNotificationSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const POST = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, createNotificationSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { title, message, type, link, userIds } = validation.data;

        // If userIds is empty or not provided, send to all users
        let targetUserIds = userIds;
        if (!targetUserIds || targetUserIds.length === 0) {
            const users = await db.collection('user').find({}, { projection: { _id: 1 } }).toArray();
            targetUserIds = users.map(u => u._id.toString());
        }

        // Prefix the link with the businessId so we can filter notifications per business
        const businessLink = `business:${user.businessId}:${link ?? ''}`;

        // Create notifications for all target users
        const notificationsData = targetUserIds.map((userId: string) => ({
            userId,
            title,
            message,
            type,
            link: businessLink,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const result = await db.collection('notification').insertMany(notificationsData);

        return successResponse(
            { count: result.insertedCount },
            `Notification sent to ${result.insertedCount} users`,
            201
        );
    } catch (error) {
        return handleRouteError(error);
    }
});

export const GET = requireBusinessAuth(async (request: NextRequest, user) => {
    try {
        // Return only notifications sent by users belonging to this business's products
        // We deduplicate by (title, message, type) sent in the same batch, using the link
        // field to store the businessId as a prefix when creating notifications.
        // Filtering by link prefix `business:<id>` ensures isolation per business.
        const pipeline = [
            { $match: { link: { $regex: `^business:${user.businessId}:` } } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: { title: "$title", message: "$message" },
                    notification: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$notification" } },
            { $sort: { createdAt: -1 } },
            { $limit: 50 },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    title: 1,
                    message: 1,
                    type: 1,
                    createdAt: 1
                }
            }
        ];

        const recentNotifications = await db.collection('notification').aggregate(pipeline).toArray();

        return successResponse(recentNotifications);
    } catch (error) {
        return handleRouteError(error);
    }
});
