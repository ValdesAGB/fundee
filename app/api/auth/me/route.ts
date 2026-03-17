import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile data.
 * This is a convenience endpoint for the frontend to quickly get session info.
 */
export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const userProfile = await db.collection('user').findOne({ id: user.userId });

        if (!userProfile) {
            return Errors.notFound('User');
        }

        return successResponse({
            id: userProfile.id || userProfile._id.toString(),
            email: userProfile.email,
            name: userProfile.name,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone,
            description: userProfile.description, // ✅ ajouté
            address: userProfile.address,         // ✅ ajouté
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
