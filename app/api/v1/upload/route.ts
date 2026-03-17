import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/middleware';
import { handleRouteError } from '@/lib/errors';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = requireAuth(async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Convertir en buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload vers Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'promodoro/products' },
                (error, result) => {
                    if (error || !result) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return Response.json({ success: true, url: result.secure_url });
    } catch (error) {
        return handleRouteError(error);
    }
});