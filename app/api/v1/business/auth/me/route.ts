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

        const { name, phone, description, address, categoryIds, avatar } = validation.data;

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (description !== undefined) updateData.description = description;
        if (address !== undefined) updateData.address = address;
        if (categoryIds !== undefined) updateData.categoryIds = categoryIds;
        if (avatar !== undefined) updateData.image = avatar;

        await db.collection("user").updateOne(
            { _id: new ObjectId(user.userId) },
            { $set: updateData },
        );

        // Synchroniser également dans la collection 'business'
        // Si le business n'existe pas encore (compte créé avant la synchronisation), on l'upsert
        const userDoc = await db.collection("user").findOne({ _id: new ObjectId(user.userId) });
        if (userDoc) {
            // Nettoyer updateData pour la collection business (qui stocke 'logo' au lieu de 'image')
            const businessUpdateData = { ...updateData };
            delete businessUpdateData.image; // Ne pas stocker le champ 'image' de user dans business

            await db.collection("business").updateOne(
                { _id: new ObjectId(user.userId) },
                {
                    $set: {
                        email: userDoc.email,
                        name: userDoc.name,
                        description: userDoc.description || "",
                        phone: userDoc.phone || "",
                        address: userDoc.address || "",
                        logo: userDoc.image || "",
                        rating: userDoc.rating || 5.0,
                        isActive: true,
                        ...businessUpdateData,
                    }
                },
                { upsert: true }
            );
        }

        return successResponse(
            { name, phone, description, address, categoryIds, avatar },
            "Profil mis à jour",
        );
    } catch (error) {
        return handleRouteError(error);
    }
});
