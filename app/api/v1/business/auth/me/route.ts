import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

async function getSession(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;
    return session.user;
}


export const GET = async (request: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return Response.json(
                { error: 'Unauthorized', message: 'Authentication required' },
                { status: 401 }
            );
        }

        // ✅ Lire directement depuis la DB au lieu de la session
        const user = await db.collection('user').findOne({
            _id: new ObjectId(session.user.id)
        });

        if (!user) {
            return Response.json(
                { error: 'Not found', message: 'Utilisateur introuvable' },
                { status: 404 }
            );
        }

        return successResponse({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            description: user.description || "",
            address: user.address || "",
            role: user.role || "BUSINESS",
        });
    } catch (error) {
        return handleRouteError(error);
    }
};

export const PUT = async (request: NextRequest) => {
    try {
        const user = await getSession(request);
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, phone, description, address } = body;

        await db.collection('user').updateOne(
           { _id: new ObjectId(user.id) }, 
            {
                $set: {
                    name,
                    phone,
                    description,
                    address,
                    updatedAt: new Date(),
                }
            }
        );

        return successResponse({ name, phone, description, address }, 'Profil mis à jour');
    } catch (error) {
        return handleRouteError(error);
    }
};