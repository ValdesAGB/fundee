import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, handleRouteError } from '@/lib/errors';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

        const query: any = { isActive: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const pipeline = [
            { $match: query },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $addFields: {
                                id: { $toString: '$_id' }
                            }
                        },
                        { $project: { _id: 0, password: 0 } }
                    ]
                }
            }
        ];

        const result = await db.collection('business').aggregate(pipeline).toArray();
        const facetResult = result[0];
        
        const total = facetResult.metadata[0]?.total || 0;
        const businesses = facetResult.data;

        return successResponse({
            businesses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleRouteError(error);
    }
}
