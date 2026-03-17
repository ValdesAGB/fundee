import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, updateUserProfileSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const userProfile = await db.collection('user').findOne(
            { id: user.userId }, // BetterAuth uses 'id' string field by default for users if configured that way, or we need to check if we use ObjectId. Let's use id. If not found, try String(_id). Wait, better-auth with mongo sets '_id' and 'id'. Actually we use `id: user.userId` or `_id: new ObjectId(user.userId)`. But auth creates _id. So `id` might not exist directly. Wait, the middleware gives us user.userId which is the string version of _id. Let's assume user.id.
        );

        if (!userProfile) {
            // Let's fallback to search by string id
            const userProfileFallback = await db.collection('user').findOne({ id: user.userId });
            if (!userProfileFallback) {
                return Errors.notFound('User');
            }
            return successResponse({
                id: userProfileFallback._id.toString(),
                email: userProfileFallback.email,
                name: userProfileFallback.name,
                firstName: userProfileFallback.firstName,
                lastName: userProfileFallback.lastName,
                phone: userProfileFallback.phone,
                image: userProfileFallback.image,
                role: userProfileFallback.role,
                notificationsEnabled: userProfileFallback.notificationsEnabled,
                createdAt: userProfileFallback.createdAt,
                updatedAt: userProfileFallback.updatedAt,
            });
        }

        return successResponse({
                id: userProfile._id.toString(),
                email: userProfile.email,
                name: userProfile.name,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                phone: userProfile.phone,
                image: userProfile.image,
                role: userProfile.role,
                notificationsEnabled: userProfile.notificationsEnabled,
                createdAt: userProfile.createdAt,
                updatedAt: userProfile.updatedAt,
        });
    } catch (error) {
        return handleRouteError(error);
    }
});

export const PUT = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, updateUserProfileSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        // We check with id: user.userId since better auth uses string id
        const userDoc = await db.collection('user').findOne({ id: user.userId });
        
        if(!userDoc) {
             return Errors.notFound('User');
        }

        const updateData = { ...validation.data, updatedAt: new Date() };

        await db.collection('user').updateOne(
            { _id: userDoc._id },
            { $set: updateData }
        );

        const updatedUser = await db.collection('user').findOne({ _id: userDoc._id });

        return successResponse({
            id: updatedUser?._id.toString(),
            email: updatedUser?.email,
            name: updatedUser?.name,
            firstName: updatedUser?.firstName,
            lastName: updatedUser?.lastName,
            phone: updatedUser?.phone,
            image: updatedUser?.image,
            role: updatedUser?.role,
            notificationsEnabled: updatedUser?.notificationsEnabled,
            updatedAt: updatedUser?.updatedAt,
        }, 'Profile updated successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});
