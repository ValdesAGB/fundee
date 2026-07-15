import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { validateBody, forgetPasswordSchema } from "@/lib/validation";
import { Errors, successResponse, handleRouteError } from "@/lib/errors";
import { sendResetCodeEmail } from "@/lib/mail";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, forgetPasswordSchema);
    if (!validation.success) {
      return Errors.validationError(validation.error);
    }

    const { email } = validation.data;
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection("verification").insertOne({
      identifier: `reset-code:${email}`,
      value: code,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await sendResetCodeEmail(email, code);

    return successResponse(
      {},
      "Si un compte existe pour cet email, un code de réinitialisation vous a été envoyé.",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
