import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, updateUserProfileSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const userProfile = await db.collection('user').findOne(
            { _id: new ObjectId(user.userId) }
        );

        if (!userProfile) {
            return Errors.notFound('User');
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

        // Find user by _id (better-auth MongoDB adapter stores userId as ObjectId)
        const userId = new ObjectId(user.userId);
        const userDoc = await db.collection('user').findOne({ _id: userId });
        
        if (!userDoc) {
             return Errors.notFound('User');
        }

        const updateData = { ...validation.data, updatedAt: new Date() };

        await db.collection('user').updateOne(
            { _id: userId },
            { $set: updateData }
        );

        const updatedUser = await db.collection('user').findOne({ _id: userId });

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
