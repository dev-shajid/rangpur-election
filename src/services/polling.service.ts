'use server'

import dbConnect from "@/lib/db";
import { PollingInfoModel } from "@/models/PollingInfo";
import { PollingInfo } from "@/types";
import { checkAdmin } from "./auth.service";
import { revalidatePath } from "next/cache";

export async function getPollingInfoByUpazila(districtId: string, upazilaId: string): Promise<PollingInfo[]> {
    try {
        await dbConnect();
        const pollingInfos = await PollingInfoModel.find({ upazilaId }).lean();

        // Convert _id to string id for frontend compatibility
        return pollingInfos.map(p => ({
            ...p,
            id: (p._id as any).toString(),
            _id: (p._id as any).toString()
        })) as unknown as PollingInfo[];
    } catch (error) {
        console.error("Error fetching polling information:", error);
        return [];
    }
}

export async function createPollingInfo(data: Omit<PollingInfo, "_id" | "id">) {
    await checkAdmin(data.upazilaId);
    await dbConnect()

    const newPollingInfo = await PollingInfoModel.create(data)
    revalidatePath(`/district/${data.districtId}/${data.upazilaId}/polling`)
    return JSON.parse(JSON.stringify(newPollingInfo))
}

export async function updatePollingInfo(id: string, data: Partial<PollingInfo>) {
    await dbConnect()
    const currentPollingInfo = await PollingInfoModel.findById(id)
    if (!currentPollingInfo) throw new Error("Polling information not found")

    await checkAdmin(currentPollingInfo.upazilaId)

    const updatedPollingInfo = await PollingInfoModel.findByIdAndUpdate(id, data, { new: true })
    if (!updatedPollingInfo) throw new Error("Polling information not found")

    revalidatePath(`/district/${updatedPollingInfo.districtId}/${updatedPollingInfo.upazilaId}/polling`)
    return JSON.parse(JSON.stringify(updatedPollingInfo))
}

export async function deletePollingInfo(id: string, districtId: string, upazilaId: string) {
    await checkAdmin(upazilaId)
    await dbConnect()

    await PollingInfoModel.findByIdAndDelete(id)
    revalidatePath(`/district/${districtId}/${upazilaId}/polling`)
    return { success: true }
}
