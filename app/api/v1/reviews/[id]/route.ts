import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, updateReviewSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const PUT = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;
        const validation = await validateBody(request, updateReviewSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        // Find review and verify ownership
        let review;
        try {
            review = await db.collection('review').findOne({ _id: new ObjectId(id) });
        } catch {
            return Errors.notFound('Review');
        }

        if (!review) {
            return Errors.notFound('Review');
        }

        if (review.userId !== user.userId) {
            return Errors.forbidden();
        }

        // Update review
        const updateData = { ...validation.data, updatedAt: new Date() };
        await db.collection('review').updateOne(
            { _id: review._id },
            { $set: updateData }
        );

        // Simulate Prisma `include: { user: ... }`
        const reviewUser = await db.collection('user').findOne(
             { _id: new ObjectId(user.userId) },
             { projection: { firstName: 1, lastName: 1, image: 1 } }
        );

        const formattedUser = reviewUser ? { ...reviewUser, id: reviewUser._id.toString(), avatar: reviewUser.image, _id: undefined, image: undefined } : null;

        const updatedReview = {
            ...review,
            ...updateData,
            id: review._id.toString(),
            _id: undefined,
            user: formattedUser
        };

        return successResponse(updatedReview, 'Review updated successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});

export const DELETE = requireAuth(async (
    request: NextRequest,
    user,
    { params }: any
) => {
    try {
        const { id } = await params;

        // Find review and verify ownership
        const review = await db.collection('review').findOne({ _id: new ObjectId(id) });

        if (!review) {
            return Errors.notFound('Review');
        }

        if (review.userId !== user.userId) {
            return Errors.forbidden();
        }

        // Delete review
        await db.collection('review').deleteOne({ _id: review._id });

        return successResponse(null, 'Review deleted successfully');
    } catch (error) {
        return handleRouteError(error);
    }
});
