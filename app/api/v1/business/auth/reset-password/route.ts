import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { validateBody, resetPasswordSchema } from "@/lib/validation";
import { Errors, successResponse, handleRouteError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, resetPasswordSchema);
    if (!validation.success) {
      return Errors.validationError(validation.error);
    }

    const { token, newPassword } = validation.data;

    await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    });

    return successResponse({}, "Mot de passe réinitialisé avec succès.");
  } catch (error) {
    return handleRouteError(error);
  }
}
