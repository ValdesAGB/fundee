import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateBusinessToken } from '@/lib/auth';
import { validateBody, registerBusinessSchema } from '@/lib/validation';
import { Errors, successResponse, handleRouteError } from '@/lib/errors';

export async function POST(request: NextRequest) {
    try {
        // Validate request body
        const validation = await validateBody(request, registerBusinessSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { email, password, name, description, phone, address } = validation.data;

        // Check if business already exists
        const existingBusiness = await db.collection('business').findOne({ email });

        if (existingBusiness) {
            return Errors.conflict('Business with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        const now = new Date();

        // Create business
        const result = await db.collection('business').insertOne({
            email,
            password: hashedPassword,
            name,
            description,
            phone,
            address,
            createdAt: now,
            updatedAt: now
        });

        const businessId = result.insertedId.toString();

        // Generate Business JWT token
        const token = generateBusinessToken({
            businessId,
            email,
            role: 'BUSINESS',
        });

        return successResponse(
            {
                business: {
                    id: businessId,
                    email,
                    name,
                    description,
                    phone,
                    address,
                    createdAt: now
                },
                token,
            },
            'Business registered successfully',
            201
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
