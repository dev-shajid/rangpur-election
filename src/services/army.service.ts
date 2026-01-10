'use server'

import dbConnect from "@/lib/db";
import { ArmyCampModel } from "@/models/ArmyCamp";
import { ArmyCamp } from "@/types";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "./auth.service";

export async function getArmyCampsByUpazila(upazilaId: string): Promise<ArmyCamp[]> {
    try {
        await dbConnect();
        const camps = await ArmyCampModel.find({ upazilaId }).lean();

        return camps.map(c => ({
            ...c,
            id: (c._id as any).toString(),
            _id: (c._id as any).toString()
        })) as unknown as ArmyCamp[];
    } catch (error) {
        console.error("Error fetching army camps:", error);
        return [];
    }
}

export async function createArmyCamp(data: Omit<ArmyCamp, "_id" | "id">) {
    await checkAdmin(data.upazilaId);
    await dbConnect()

    const newCamp = await ArmyCampModel.create(data)
    revalidatePath(`/district/${data.districtId}/${data.upazilaId}/army-camps`)
    return JSON.parse(JSON.stringify(newCamp))
}

export async function updateArmyCamp(id: string, data: Partial<ArmyCamp>) {
    await dbConnect()
    const currentCamp = await ArmyCampModel.findById(id)
    if (!currentCamp) throw new Error("Army Camp not found")

    await checkAdmin(currentCamp.upazilaId)

    const updatedCamp = await ArmyCampModel.findByIdAndUpdate(id, data, { new: true })
    if (!updatedCamp) throw new Error("Army Camp not found")

    revalidatePath(`/district/${updatedCamp.districtId}/${updatedCamp.upazilaId}/army-camps`)
    return JSON.parse(JSON.stringify(updatedCamp))
}

export async function deleteArmyCamp(id: string, districtId: string, upazilaId: string) {
    await checkAdmin(upazilaId)
    await dbConnect()

    await ArmyCampModel.findByIdAndDelete(id)
    revalidatePath(`/district/${districtId}/${upazilaId}/army-camps`)
    return { success: true }
}
