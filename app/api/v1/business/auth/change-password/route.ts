import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { successResponse, Errors, handleRouteError } from "@/lib/errors";
import { ObjectId } from "mongodb";

export const POST = async (request: NextRequest) => {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return Errors.validationError('Les deux mots de passe sont requis');
        }

        if (newPassword.length < 8) {
            return Errors.validationError('Le nouveau mot de passe doit contenir au moins 8 caractères');
        }

        // ✅ Utiliser l'API Better Auth directement
        await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: false,
            },
            headers: request.headers,
        });

        return successResponse(null, 'Mot de passe mis à jour avec succès');
    } catch (error: any) {
        if (error?.message?.includes('invalid') || error?.status === 401) {
            return Response.json(
                { error: 'Unauthorized', message: 'Mot de passe actuel incorrect' },
                { status: 401 }
            );
        }
        return handleRouteError(error);
    }
};