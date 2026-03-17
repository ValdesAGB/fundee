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

    response.cookies.delete("better-auth.session_data");
    response.cookies.delete("better-auth.session_token");

    return response;
  } catch (error) {
    return handleRouteError(error);
  }
};