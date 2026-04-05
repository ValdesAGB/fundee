import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { validateBody, forgetPasswordSchema } from "@/lib/validation";
import { Errors, successResponse, handleRouteError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, forgetPasswordSchema);
    if (!validation.success) {
      return Errors.validationError(validation.error);
    }

    const { email } = validation.data;

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/admin/reset-password`,
      },
    });

    return successResponse(
      {},
      "Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
