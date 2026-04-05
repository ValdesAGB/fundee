import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, Errors, handleRouteError } from "@/lib/errors";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Errors.validationError("Les deux mots de passe sont requis");
    }

    if (newPassword.length < 8) {
      return Errors.validationError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères",
      );
    }

    try {
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        },
        headers: request.headers,
      });
    } catch (innerError: any) {
      // Better Auth lance une erreur avec status 400 quand le mot de passe est incorrect
      return Response.json(
        { success: false, message: "Le mot de passe actuel est incorrect." },
        { status: 400 },
      );
    }

    return successResponse(null, "Mot de passe mis à jour avec succès");
  } catch (error: any) {
    return handleRouteError(error);
  }
};
