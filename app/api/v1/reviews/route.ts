import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware';
import { validateBody, createReviewSchema } from '@/lib/validation';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';

export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, createReviewSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { productId, rating, comment } = validation.data;

        // Check if product exists
        let product;
        try {
            product = await db.collection('product').findOne({ _id: new ObjectId(productId) });
        } catch {
            return Errors.notFound('Product');
        }

        if (!product) {
            return Errors.notFound('Product');
        }

        // Check if user already reviewed this product
        const existingReview = await db.collection('review').findOne({
            userId: user.userId,
            productId,
        });

        if (existingReview) {
            return Errors.conflict('You have already reviewed this product');
        }

        // Create review
        const reviewData = {
            userId: user.userId,
            productId,
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('review').insertOne(reviewData);

        // Fetch user data (simplified since better auth uses the 'user' collection)
        // This simulates Prisma's `include: { user: ..., product: ... }`
        const reviewUser = await db.collection('user').findOne(
             { _id: new ObjectId(user.userId) },
             { projection: { name: 1, firstName: 1, lastName: 1, image: 1 } }
        );

        const formattedUser = reviewUser ? { ...reviewUser, id: reviewUser._id.toString(), _id: undefined } : null;

        const review = {
            ...reviewData,
            id: result.insertedId.toString(),
            _id: undefined,
            user: formattedUser,
            product: {
                id: product._id.toString(),
                name: product.name,
            }
        };

        return successResponse(review, 'Review submitted successfully', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});
