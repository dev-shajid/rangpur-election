'use server'

import dbConnect from "@/lib/db";
import { DistrictMapModel, IDistrictMap } from "@/models/DistrictMap";
import { UpazilaMapModel, IUpazilaMap } from "@/models/UpazilaMap";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// District Map Functions
export async function getDistrictMap(districtId: string): Promise<IDistrictMap | null> {
    try {
        await dbConnect();
        const map = await DistrictMapModel.findOne({ districtId }).lean();

        if (!map) return null;

        return {
            ...map,
            id: (map._id as any).toString(),
            _id: (map._id as any).toString()
        } as unknown as IDistrictMap;
    } catch (error) {
        console.error("Error fetching district map:", error);
        return null;
    }
}

export async function createOrUpdateDistrictMap(districtId: string, data: { mapUrl: string; title: string; description?: string }) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized: Must be logged in");
    }

    // Check if user is superadmin or district admin
    const userRole = session.user.role;
    if (userRole !== "superadmin" && userRole !== districtId) {
        throw new Error("Unauthorized: Only superadmin or district admin can update district map");
    }

    await dbConnect();

    const existingMap = await DistrictMapModel.findOne({ districtId });

    let result;
    if (existingMap) {
        result = await DistrictMapModel.findByIdAndUpdate(
            existingMap._id,
            data,
            { new: true }
        );
    } else {
        result = await DistrictMapModel.create({ ...data, districtId });
    }

    revalidatePath(`/district/${districtId}`);
    return JSON.parse(JSON.stringify(result));
}

export async function deleteDistrictMap(districtId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized: Must be logged in");
    }

    const userRole = session.user.role;
    if (userRole !== "superadmin" && userRole !== districtId) {
        throw new Error("Unauthorized: Only superadmin or district admin can delete district map");
    }

    await dbConnect();
    await DistrictMapModel.deleteOne({ districtId });
    revalidatePath(`/district/${districtId}`);
    return { success: true };
}

// Upazila Map Functions
export async function getUpazilaMap(districtId: string, upazilaId: string): Promise<IUpazilaMap | null> {
    try {
        await dbConnect();
        const map = await UpazilaMapModel.findOne({ districtId, upazilaId }).lean();

        if (!map) return null;

        return {
            ...map,
            id: (map._id as any).toString(),
            _id: (map._id as any).toString()
        } as unknown as IUpazilaMap;
    } catch (error) {
        console.error("Error fetching upazila map:", error);
        return null;
    }
}

export async function createOrUpdateUpazilaMap(districtId: string, upazilaId: string, data: { mapUrl: string; title: string; description?: string }) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized: Must be logged in");
    }

    const userRole = session.user.role;
    if (userRole !== "superadmin" && userRole !== upazilaId) {
        throw new Error("Unauthorized: Only superadmin or district admin can update upazila map");
    }

    await dbConnect();

    const existingMap = await UpazilaMapModel.findOne({ districtId, upazilaId });

    let result;
    if (existingMap) {
        result = await UpazilaMapModel.findByIdAndUpdate(
            existingMap._id,
            data,
            { new: true }
        );
    } else {
        result = await UpazilaMapModel.create({ ...data, districtId, upazilaId });
    }

    revalidatePath(`/district/${districtId}/${upazilaId}`);
    return JSON.parse(JSON.stringify(result));
}

export async function deleteUpazilaMap(districtId: string, upazilaId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized: Must be logged in");
    }

    const userRole = session.user.role;
    if (userRole !== "superadmin" && userRole !== districtId) {
        throw new Error("Unauthorized: Only superadmin or district admin can delete upazila map");
    }

    await dbConnect();
    await UpazilaMapModel.deleteOne({ districtId, upazilaId });
    revalidatePath(`/district/${districtId}/${upazilaId}`);
    return { success: true };
}
