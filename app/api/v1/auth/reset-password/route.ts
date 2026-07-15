import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { validateBody, resetPasswordWithCodeSchema } from "@/lib/validation";
import { Errors, successResponse, handleRouteError } from "@/lib/errors";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, resetPasswordWithCodeSchema);
    if (!validation.success) {
      return Errors.validationError(validation.error);
    }

    const { email, code, newPassword } = validation.data;

    const verification = await db.collection("verification").findOne({
      identifier: `reset-code:${email}`,
    });

    if (!verification) {
      return Errors.badRequest("Aucun code de réinitialisation trouvé. Veuillez refaire une demande.");
    }

    if (verification.expiresAt < new Date()) {
      await db.collection("verification").deleteOne({ _id: verification._id });
      return Errors.badRequest("Le code a expiré. Veuillez refaire une demande.");
    }

    if (verification.value !== code) {
      return Errors.badRequest("Code invalide.");
    }

    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return Errors.notFound("Utilisateur");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.collection("account").updateOne(
      { userId: user.id, providerId: "credential" },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
    );

    await db.collection("verification").deleteOne({ _id: verification._id });

    return successResponse({}, "Mot de passe réinitialisé avec succès.");
  } catch (error) {
    return handleRouteError(error);
  }
}
