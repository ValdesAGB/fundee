import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { bearer } from "better-auth/plugins";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(db),

  /**
   * Email + password authentication
   */
  emailAndPassword: {
    enabled: true,
    // bcrypt cost factor (default: 10, we keep 12 for security)
    hashOptions: { rounds: 12 },
  },

  /**
   * Bearer token plugin — enables Authorization: Bearer <token> in addition
   * to cookies. Required for the Flutter mobile app which uses Dio + JWT-like
   * header-based auth.
   */
  plugins: [bearer()],

  /**
   * Session configuration
   */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // extend by 1 day on each use
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-minute client-side cache
    },
  },

  /**
   * Additional fields stored on the User model beyond the better-auth defaults
   * (id, email, name, image, emailVerified, createdAt, updatedAt)
   */
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "BUSINESS",
        input: true,
      },
      description: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
      notificationsEnabled: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: true,
      },
    },
  },
});

/**
 * Convenience type for the authenticated user returned by better-auth sessions.
 * Mirrors the old TokenPayload interface used throughout the middleware.
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "BUSINESS" | "ADMIN";
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  image?: string | null;
  emailVerified: boolean;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Legacy Business JWT helpers ─────────────────────────────────────────────
// Business accounts are NOT managed by better-auth (they are a separate entity).
// We keep a minimal JWT implementation scoped to Business auth only.
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const BUSINESS_JWT_SECRET =
  process.env.BUSINESS_JWT_SECRET || process.env.JWT_SECRET;
if (!BUSINESS_JWT_SECRET) {
  throw new Error("BUSINESS_JWT_SECRET environment variable is required");
}
const BUSINESS_JWT_EXPIRES_IN = "7d";

export interface BusinessTokenPayload {
  businessId: string;
  email: string;
  role: "BUSINESS";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateBusinessToken(payload: BusinessTokenPayload): string {
  return jwt.sign(payload, BUSINESS_JWT_SECRET as string, {
    expiresIn: BUSINESS_JWT_EXPIRES_IN,
  });
}

export function verifyBusinessToken(
  token: string,
): BusinessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, BUSINESS_JWT_SECRET as string);
    return decoded as unknown as BusinessTokenPayload;
  } catch {
    return null;
  }
}
