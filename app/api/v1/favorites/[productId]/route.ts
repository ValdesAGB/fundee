import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';

export const DELETE = requireAuth(async (
    request: NextRequest,
    user,
    { params }: { params: Promise<{ productId: string }> }
) => {
    try {
        const { productId } = await params;

        // Find and verify ownership
        const favorite = await db.collection('favorite').findOne({
            userId: user.userId,
            productId,
        });

        if (!favorite) {
            return Errors.notFound('Favorite');
        }

        // Remove from favorites
        await db.collection('favorite').deleteOne({ _id: favorite._id });

        return successResponse(null, 'Removed from favorites');
    } catch (error) {
        return handleRouteError(error);
    }
});
