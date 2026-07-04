import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";
import { successResponse, Errors, handleRouteError } from "@/lib/errors";
import { validateBody, updateBusinessProfileSchema } from "@/lib/validation";
import { ObjectId } from "mongodb";

export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const userData = await db.collection("user").findOne({
            _id: new ObjectId(user.userId),
        });

        if (!userData) {
            return Response.json(
                { error: "Not found", message: "Utilisateur introuvable" },
                { status: 404 },
            );
        }

        return successResponse({
            id: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            description: userData.description || "",
            address: userData.address || "",
            categoryIds: userData.categoryIds || [],
            avatar: userData.image || "",
            role: userData.role || "BUSINESS",
        });
    } catch (error) {
        return handleRouteError(error);
    }
});

export const PUT = requireAuth(async (request: NextRequest, user) => {
    try {
        const validation = await validateBody(request, updateBusinessProfileSchema);

        if (!validation.success) {
            return Errors.validationError(validation.error);
        }

        const { name, phone, description, address, categoryIds } = validation.data;

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (description !== undefined) updateData.description = description;
        if (address !== undefined) updateData.address = address;
        if (categoryIds !== undefined) updateData.categoryIds = categoryIds;

        await db.collection("user").updateOne(
            { _id: new ObjectId(user.userId) },
            { $set: updateData },
        );

        return successResponse(
            { name, phone, description, address, categoryIds },
            "Profil mis à jour",
        );
    } catch (error) {
        return handleRouteError(error);
    }
});
