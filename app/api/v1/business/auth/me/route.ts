import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireBusinessAuth } from "@/lib/middleware";
import { successResponse, Errors, handleRouteError } from "@/lib/errors";
import { validateBody, updateBusinessProfileSchema } from "@/lib/validation";
import { ObjectId } from "mongodb";

export const GET = requireBusinessAuth(async (request: NextRequest, business) => {
    try {
        const businessData = await db.collection("business").findOne({
            _id: new ObjectId(business.businessId),
        });

        if (!businessData) {
            return Response.json(
                { error: "Not found", message: "Business introuvable" },
                { status: 404 },
            );
        }

        return successResponse({
            id: businessData._id.toString(),
            name: businessData.name,
            email: businessData.email,
            phone: businessData.phone || "",
            description: businessData.description || "",
            address: businessData.address || "",
            categoryIds: businessData.categoryIds || [],
            avatar: businessData.logo || "",
            role: "BUSINESS",
        });
    } catch (error) {
        return handleRouteError(error);
    }
});

export const PUT = requireBusinessAuth(async (request: NextRequest, business) => {
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

        await db.collection("business").updateOne(
            { _id: new ObjectId(business.businessId) },
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