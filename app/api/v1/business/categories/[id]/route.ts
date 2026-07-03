import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireBusinessAuth } from '@/lib/middleware';
import { successResponse, Errors, handleRouteError } from '@/lib/errors';
import { validateBody, updateBusinessCategorySchema } from '@/lib/validation';

export const PUT = requireBusinessAuth(async (request: NextRequest, business, { params }: any) => {
    try {
        const { id } = await params;

        const validation = await validateBody(request, updateBusinessCategorySchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { name, description, icon } = validation.data;

        // Verify category belongs to this business
        let category;
        try {
            category = await db.collection('category').findOne({
                _id: new ObjectId(id),
                businessId: business.businessId
            });
        } catch {
            return Errors.notFound('Catégorie');
        }

        if (!category) {
            return Errors.notFound('Catégorie');
        }

        const updateData: any = { updatedAt: new Date() };
        if (name !== undefined) {
            updateData.name = name.trim();
            updateData.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + `-${Date.now().toString(36)}`;
        }
        if (description !== undefined) updateData.description = description;
        if (icon !== undefined) updateData.icon = icon;

        await db.collection('category').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        const updated = await db.collection('category').findOne({ _id: new ObjectId(id) });

        return successResponse({
            ...updated,
            id: updated!._id.toString(),
            _id: undefined
        }, 'Catégorie mise à jour');
    } catch (error) {
        return handleRouteError(error);
    }
});

export const DELETE = requireBusinessAuth(async (request: NextRequest, business, { params }: any) => {
    try {
        const { id } = await params;

        // Verify category belongs to this business
        const category = await db.collection('category').findOne({
            _id: new ObjectId(id),
            businessId: business.businessId
        });

        if (!category) {
            return Errors.notFound('Catégorie');
        }

        // Check if any products use this category
        const productCount = await db.collection('product').countDocuments({ categoryId: id });
        if (productCount > 0) {
            return Errors.badRequest('Impossible de supprimer : des produits utilisent cette catégorie');
        }

        await db.collection('category').deleteOne({ _id: new ObjectId(id) });

        return successResponse(null, 'Catégorie supprimée');
    } catch (error) {
        return handleRouteError(error);
    }
});