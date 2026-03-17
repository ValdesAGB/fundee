import { NextRequest } from 'next/server';
import { auth, AuthUser, verifyBusinessToken, BusinessTokenPayload } from './auth';

/**
 * Unified user payload type used throughout route handlers.
 * For User routes  → populated from better-auth session.
 * For Business routes → populated from Business JWT.
 */
export type TokenPayload = {
    userId: string;
    email: string;
    role: 'USER' | 'BUSINESS' | 'ADMIN';
};

// ─── User auth helpers (better-auth) ──────────────────────────────────────────

/**
 * Retrieve the better-auth session for the current request.
 * Supports both cookie-based sessions and Bearer token (via the bearer plugin).
 */
async function getUserFromSession(request: NextRequest): Promise<AuthUser | null> {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;
    return session.user as AuthUser;
}

/**
 * Higher-order function that protects a route handler with better-auth.
 * Injects the authenticated user as a `TokenPayload` (same interface as before).
 *
 * @example
 * export const GET = requireAuth(async (req, user) => { ... });
 */
export function requireAuth(
    handler: (request: NextRequest, user: TokenPayload, ...args: any[]) => Promise<Response>
) {
    return async (request: NextRequest, ...args: any[]): Promise<Response> => {
        const user = await getUserFromSession(request);

        if (!user) {
            return Response.json(
                { error: 'Unauthorized', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        return handler(request, payload, ...args);
    };
}

/**
 * Higher-order function that protects a route and enforces a specific role.
 * ADMIN always passes regardless of the required role.
 *
 * @example
 * export const GET = requireRole('BUSINESS', async (req, user) => { ... });
 */
export function requireRole(
    role: 'USER' | 'BUSINESS' | 'ADMIN',
    handler: (request: NextRequest, user: TokenPayload, ...args: any[]) => Promise<Response>
) {
    return requireAuth(async (request: NextRequest, user: TokenPayload, ...args: any[]) => {
        if (user.role !== role && user.role !== 'ADMIN') {
            return Response.json(
                { error: 'Forbidden', message: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return handler(request, user, ...args);
    });
}

// ─── Business auth helpers (legacy JWT, scoped to Business entity only) ────────

function extractBearerToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
}

/**
 * Higher-order function that protects a Business route using the Business JWT.
 * Injects a `TokenPayload` with `role: 'BUSINESS'`.
 *
 * @example
 * export const GET = requireBusinessAuth(async (req, business) => { ... });
 */
export function requireBusinessAuth(
    handler: (request: NextRequest, business: TokenPayload & { businessId: string }, ...args: any[]) => Promise<Response>
) {
    return async (request: NextRequest, ...args: any[]): Promise<Response> => {
        const token = extractBearerToken(request);

        if (!token) {
            return Response.json(
                { error: 'Unauthorized', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload: BusinessTokenPayload | null = verifyBusinessToken(token);

        if (!payload) {
            return Response.json(
                { error: 'Unauthorized', message: 'Token invalide ou expiré' },
                { status: 401 }
            );
        }

        const businessPayload = {
            userId: payload.businessId,
            businessId: payload.businessId,
            email: payload.email,
            role: 'BUSINESS' as const,
        };

        return handler(request, businessPayload, ...args);
    };
}
