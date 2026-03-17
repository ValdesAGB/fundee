import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * better-auth catch-all handler.
 *
 * Mounts all better-auth endpoints under /api/auth/:
 *   POST /api/auth/sign-up/email          — register with email + password
 *   POST /api/auth/sign-in/email          — login with email + password
 *   POST /api/auth/sign-out               — logout (clears session)
 *   GET  /api/auth/session                — get current session
 *   POST /api/auth/get-session            — get current session (POST variant)
 *   POST /api/auth/token                  — exchange session for Bearer token (bearer plugin)
 *   POST /api/auth/forget-password        — request password reset email
 *   POST /api/auth/reset-password         — reset password with token
 *   POST /api/auth/verify-email           — verify email address
 *   POST /api/auth/send-verification-email — resend verification email
 */
export const { POST, GET } = toNextJsHandler(auth);
