import { NextRequest, NextResponse } from 'next/server';
import { requireBusinessAuth } from '@/lib/middleware';
import { Errors, handleRouteError } from '@/lib/errors';

/**
 * POST /api/v1/business/auth/logout
 *
 * Business JWT is stateless — there is no server-side session to invalidate.
 * This endpoint exists so the mobile/web client can call a single URL and
 * receive a clear instruction to drop the locally stored token.
 *
 * If a token blocklist is added in the future (Redis / DB), the logic goes here.
 */
// /api/v1/business/auth/logout

export const POST = async (_req: NextRequest) => {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // ✅ Cookies HTTP (développement)
    response.cookies.delete("better-auth.session_token");
    response.cookies.delete("better-auth.session_data");

    // ✅ Cookies HTTPS (production Vercel)
    response.cookies.delete("__Secure-better-auth.session_token");
    response.cookies.delete("__Secure-better-auth.session_data");

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
};