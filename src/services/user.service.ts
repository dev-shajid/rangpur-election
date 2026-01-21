'use server'

import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import { UserModel } from "@/models/User"
import { Role, User } from "@/types"
import { revalidatePath } from "next/cache"

/**
 * Checks if the current user is a superadmin.
 * This is used for general administrative tasks like user management.
 */
async function checkSuperAdmin() {
    const session = await auth()
    if (session?.user?.role !== "superadmin" || session?.user?.email !== "co1sigbn@gmail.com.com") {
        throw new Error("Unauthorized: Superadmin access required")
    }
    return true
}

export async function getAllUsers(): Promise<User[]> {
    await checkSuperAdmin()
    await dbConnect()

    const users = await UserModel.find({}).lean()

    return users.map(user => ({
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role as Role
    }))
}

export async function updateUserRole(userId: string, role: string | undefined): Promise<void> {
    await checkSuperAdmin()
    await dbConnect()

    await UserModel.findByIdAndUpdate(userId, { role })
    revalidatePath("/admin/users")
}

export async function deleteUser(userId: string): Promise<void> {
    await checkSuperAdmin()
    await dbConnect()

    await UserModel.findByIdAndDelete(userId)
    revalidatePath("/admin/users")
}
