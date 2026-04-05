import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { bearer } from "better-auth/plugins";
import { db } from "@/lib/db";
import { sendBusinessResetPasswordEmail } from "@/lib/mail";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    hashOptions: { rounds: 12 },
    sendResetPassword: async ({ user, url }) => {
      // Extraire le token de l'URL générée par Better Auth
      const token = new URL(url).searchParams.get("token") || "";
      await sendBusinessResetPasswordEmail(user.email, url);
    },
  },

  plugins: [bearer()],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  user: {
    additionalFields: {
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
      phone: { type: "string", required: false, input: true },
      role: {
        type: "string",
        required: false,
        defaultValue: "BUSINESS",
        input: true,
      },
      description: { type: "string", required: false, input: true },
      address: { type: "string", required: false, input: true },
      notificationsEnabled: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: true,
      },
    },
  },
});

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
