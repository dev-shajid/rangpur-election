'use server'

import dbConnect from "@/lib/db";
import { MainMapModel, IMainMap } from "@/models/MainMap";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getMainMap(): Promise<IMainMap | null> {
    try {
        await dbConnect();
        const map = await MainMapModel.findOne().lean();

        if (!map) return null;

        return {
            ...map,
            id: (map._id as any).toString(),
            _id: (map._id as any).toString()
        } as unknown as IMainMap;
    } catch (error) {
        console.error("Error fetching main map:", error);
        return null;
    }
}

export async function createOrUpdateMainMap(data: { mapUrl: string; title: string; description?: string }) {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") {
        throw new Error("Unauthorized: Only superadmin can update main map");
    }

    await dbConnect();

    // Check if a map already exists
    const existingMap = await MainMapModel.findOne();

    let result;
    if (existingMap) {
        result = await MainMapModel.findByIdAndUpdate(
            existingMap._id,
            data,
            { new: true }
        );
    } else {
        result = await MainMapModel.create(data);
    }

    revalidatePath("/");
    return JSON.parse(JSON.stringify(result));
}

export async function deleteMainMap() {
    const session = await auth();
    if (!session?.user || session.user.role !== "superadmin") {
        throw new Error("Unauthorized: Only superadmin can delete main map");
    }

    await dbConnect();
    await MainMapModel.deleteMany({});
    revalidatePath("/");
    return { success: true };
}
