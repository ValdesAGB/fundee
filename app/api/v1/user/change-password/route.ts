import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, changePasswordSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, changePasswordSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { currentPassword, newPassword } = validation.data;

        // Fetch the user's current credentials from the better-auth accounts collection
        const userId = new ObjectId(user.userId);
        const userDoc = await db.collection('user').findOne({ _id: userId });

        if (!userDoc) {
            return Errors.notFound('User');
        }

        // Use better-auth's built-in changePassword API to handle hashing securely
        const result = await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
            },
            headers: request.headers,
        });

        if (!result) {
            return Errors.badRequest('Mot de passe actuel incorrect');
        }

        return successResponse({}, 'Mot de passe modifié avec succès');
    } catch (error: any) {
        // better-auth throws specific errors for wrong current password
        if (
            error?.message?.includes('Invalid password') ||
            error?.message?.includes('invalid_password') ||
            error?.status === 400
        ) {
            return Errors.badRequest('Mot de passe actuel incorrect');
        }
        return handleRouteError(error);
    }
});
