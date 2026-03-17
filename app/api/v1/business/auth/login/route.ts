import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateBusinessToken } from '@/lib/auth';
import { validateBody, loginSchema } from '@/lib/validation';
import { Errors, successResponse, handleRouteError } from '@/lib/errors';

export async function POST(request: NextRequest) {
    try {
        // Validate request body
        const validation = await validateBody(request, loginSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { email, password } = validation.data;

        // Find business
        const business = await db.collection('business').findOne({ email });

        if (!business) {
            return Errors.unauthorized();
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, business.password);

        if (!isValidPassword) {
            return Errors.unauthorized();
        }

        const businessId = business._id.toString();

        // Generate Business JWT token
        const token = generateBusinessToken({
            businessId,
            email: business.email,
            role: 'BUSINESS',
        });

        // Return business data (excluding password)
        const { password: _, _id, ...businessWithoutPassword } = business;

        return successResponse({
            business: { ...businessWithoutPassword, id: businessId },
            token,
        });
    } catch (error) {
        return handleRouteError(error);
    }
}
