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

    const cookieOptions = {
      expires: new Date(0),
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax" as const,
    };

    // ✅ Force l'expiration avec les bons attributs
    response.cookies.set("__Secure-better-auth.session_token", "", cookieOptions);
    response.cookies.set("__Secure-better-auth.session_data", "", cookieOptions);
    response.cookies.set("better-auth.session_token", "", { ...cookieOptions, secure: false });
    response.cookies.set("better-auth.session_data", "", { ...cookieOptions, secure: false });

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
};