import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireBusinessAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { validateBody, createBusinessCategorySchema, updateBusinessCategorySchema } from '@/lib/validation';

export const GET = requireBusinessAuth(async (request: NextRequest, business) => {
    try {
        const categories = await db.collection('category').find({
            $or: [
                { businessId: { $exists: false } },
                { businessId: null },
                { businessId: business.businessId }
            ]
        }).sort({ name: 1 }).toArray();

        const formatted = categories.map(c => ({
            ...c,
            id: c._id.toString(),
            _id: undefined
        }));

        return successResponse(formatted);
    } catch (error) {
        return handleRouteError(error);
    }
});

export const POST = requireBusinessAuth(async (request: NextRequest, business) => {
    try {
        const validation = await validateBody(request, createBusinessCategorySchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { name, description, icon } = validation.data;

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const finalSlug = `${slug}-${uniqueSuffix}`;

        const now = new Date();
        const categoryData = {
            name: name.trim(),
            slug: finalSlug,
            description,
            icon,
            businessId: business.businessId,
            isGlobal: false,
            createdAt: now,
            updatedAt: now
        };

        const result = await db.collection('category').insertOne(categoryData);

        const category = {
            ...categoryData,
            id: result.insertedId.toString()
        };

        return successResponse(category, 'Catégorie créée avec succès', 201);
    } catch (error) {
        return handleRouteError(error);
    }
});