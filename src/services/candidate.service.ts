'use server'

import dbConnect from "@/lib/db";
import { CandidateModel } from "@/models/Candidate";
import { Candidate } from "@/types";
import { checkAdmin } from "./auth.service";
import { revalidatePath } from "next/cache";

export async function getCandidatesByUpazila(districtId: string, upazilaId: string): Promise<Candidate[]> {
    try {
        await dbConnect();
        const candidates = await CandidateModel.find({ upazilaId }).lean();

        // Convert _id to string id for frontend compatibility
        return candidates.map(c => ({
            ...c,
            id: (c._id as any).toString(),
            _id: (c._id as any).toString()
        })) as unknown as Candidate[];
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
}

export async function createCandidate(data: Omit<Candidate, "_id" | "id">) {
    await checkAdmin(data.upazilaId);
    await dbConnect()

    const newCandidate = await CandidateModel.create(data)
    revalidatePath(`/district/${data.districtId}/${data.upazilaId}/candidates`)
    return JSON.parse(JSON.stringify(newCandidate))
}

export async function updateCandidate(id: string, data: Partial<Candidate>) {
    await dbConnect()
    const currentCandidate = await CandidateModel.findById(id)
    if (!currentCandidate) throw new Error("Candidate not found")

    await checkAdmin(currentCandidate.upazilaId)

    const updatedCandidate = await CandidateModel.findByIdAndUpdate(id, data, { new: true })
    if (!updatedCandidate) throw new Error("Candidate not found")

    revalidatePath(`/district/${updatedCandidate.districtId}/${updatedCandidate.upazilaId}/candidates`)
    return JSON.parse(JSON.stringify(updatedCandidate))
}

export async function deleteCandidate(id: string, districtId: string, upazilaId: string) {
    await checkAdmin(upazilaId)
    await dbConnect()

    await CandidateModel.findByIdAndDelete(id)
    revalidatePath(`/district/${districtId}/${upazilaId}/candidates`)
    return { success: true }
}