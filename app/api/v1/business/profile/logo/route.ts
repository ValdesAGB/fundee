import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireBusinessAuth } from '@/lib/middleware';
import { Errors, successResponse, handleRouteError } from '@/lib/errors';
import { ObjectId } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'business', 'logos');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Helper to ensure the upload directory exists
 */
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

/**
 * POST /api/v1/business/profile/logo
 * Upload or update the business logo
 */
export const POST = requireBusinessAuth(async (request: NextRequest, { businessId }) => {
    try {
        await ensureUploadDir();
        
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Errors.badRequest('Aucun fichier fourni');
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return Errors.badRequest('Format de fichier non supporté. Utiliser JPG, PNG ou WEBP.');
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            return Errors.badRequest('Fichier trop volumineux. La taille maximale est de 5Mo.');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.type.split('/')[1];
        const fileName = `logo_${businessId}_${crypto.randomBytes(4).toString('hex')}.${extension}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        const publicUrl = `/uploads/business/logos/${fileName}`;

        // Get current business to delete old logo if exists
        const business = await db.collection('business').findOne({ _id: new ObjectId(businessId) });
        
        if (business?.logo && typeof business.logo === 'string' && business.logo.startsWith('/uploads/')) {
            const oldPath = path.join(process.cwd(), 'public', business.logo);
            try {
                await fs.unlink(oldPath);
            } catch (err) {
                console.error('Failed to delete old logo:', err);
                // Continue anyway if old file is missing
            }
        }

        // Save new file
        await fs.writeFile(filePath, buffer);

        // Update database
        await db.collection('business').updateOne(
            { _id: new ObjectId(businessId) },
            { 
                $set: { 
                    logo: publicUrl,
                    updatedAt: new Date()
                } 
            }
        );

        return successResponse({ logo: publicUrl }, 'Logo mis à jour avec succès');
    } catch (error) {
        return handleRouteError(error);
    }
});

/**
 * DELETE /api/v1/business/profile/logo
 * Remove the business logo
 */
export const DELETE = requireBusinessAuth(async (request: NextRequest, { businessId }) => {
    try {
        const business = await db.collection('business').findOne({ _id: new ObjectId(businessId) });

        if (!business?.logo) {
            return Errors.notFound('Aucun logo à supprimer');
        }

        if (typeof business.logo === 'string' && business.logo.startsWith('/uploads/')) {
            const filePath = path.join(process.cwd(), 'public', business.logo);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Failed to delete logo file:', err);
            }
        }

        // Update database
        await db.collection('business').updateOne(
            { _id: new ObjectId(businessId) },
            { 
                $set: { 
                    logo: null,
                    updatedAt: new Date()
                } 
            }
        );

        return successResponse({}, 'Logo supprimé avec succès');
    } catch (error) {
        return handleRouteError(error);
    }
});