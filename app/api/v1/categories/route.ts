import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, handleRouteError } from '@/lib/errors';

export async function GET(request: NextRequest) {
    try {
        const categories = await db.collection('category').aggregate([
            {
                $lookup: {
                    from: 'product',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'products'
                }
            },
            {
                $addFields: {
                    _count: { products: { $size: "$products" } }
                }
            },
            {
                $project: {
                    products: 0 // Exclude products array, we only need the count
                }
            },
            {
                $sort: { name: 1 }
            }
        ]).toArray();

        const formatted = categories.map(c => ({
            ...c,
            id: c._id.toString(),
            _id: undefined
        }));

        return successResponse(formatted);
    } catch (error) {
        return handleRouteError(error);
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name?.trim()) {
            return Response.json({ error: 'Nom requis' }, { status: 400 });
        }

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // Évite les doublons
        const existing = await db.collection('category').findOne({ slug });
        if (existing) {
            return Response.json(
                { success: true, data: { ...existing, id: existing._id.toString(), _id: undefined } },
                { status: 200 }
            );
        }

        const result = await db.collection('category').insertOne({
            name: name.trim(),
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const category = {
            id: result.insertedId.toString(),
            name: name.trim(),
            slug,
        };

        return Response.json({ success: true, data: category }, { status: 201 });
    } catch (error) {
        return handleRouteError(error);
    }
}