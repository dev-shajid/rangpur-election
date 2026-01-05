'use server'

import dbConnect from "@/lib/db";
import { UpdateModel } from "@/models/Update";
import { Update } from "@/types";
import { checkAdmin } from "./auth.service";
import { revalidatePath } from "next/cache";

export async function getUpdatesByDistrict(districtId: string): Promise<Update[]> {
    try {
        await dbConnect();
        // Sort by time descending (newest first)
        // Note: 'time' is stored as string in current mock data (e.g. "2026-01-15T14:30:00Z"), 
        // so standard string sort works for ISO dates, but complex strings might need special handling.
        // Assuming ISO format from seed.
        const updates = await UpdateModel.find({ districtId }).lean();
        return updates
            .map(u => ({
                ...u,
                id: (u._id as any).toString(),
                _id: (u._id as any).toString()
            }))
            .sort((a, b) => new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime()) as unknown as Update[];

    } catch (error) {
        console.error("Error fetching updates:", error);
        return [];
    }
}

export async function getCriticalUpdatesCountByDistrict(districtId: string): Promise<number> {
    try {
        await dbConnect();
        const updateCount = await UpdateModel.countDocuments({ districtId, category: "critical" });
        return updateCount;
    } catch (error) {
        console.error("Error fetching updates:", error);
        return 0;
    }
}

export async function createUpdate(data: Omit<Update, "_id" | "id">) {
    await checkAdmin(data.districtId)
    await dbConnect()

    const newUpdate = await UpdateModel.create(data)
    revalidatePath(`/district/${data.districtId}/updates`)
    return JSON.parse(JSON.stringify(newUpdate))
}

export async function updateUpdate(id: string, data: Partial<Update>) {
    // We need to find the update first to get its districtId
    await dbConnect()
    const currentUpdate = await UpdateModel.findById(id)
    if (!currentUpdate) throw new Error("Update not found")

    await checkAdmin(currentUpdate.districtId)

    const updatedUpdate = await UpdateModel.findByIdAndUpdate(id, data, { new: true })
    if (!updatedUpdate) throw new Error("Update not found")

    revalidatePath(`/district/${updatedUpdate.districtId}/updates`)
    return JSON.parse(JSON.stringify(updatedUpdate))
}

export async function deleteUpdate(id: string, districtId: string) {
    await checkAdmin(districtId)
    await dbConnect()

    await UpdateModel.findByIdAndDelete(id)
    revalidatePath(`/district/${districtId}/updates`)
    return { success: true }
}