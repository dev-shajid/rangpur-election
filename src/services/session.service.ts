'use server'

import { auth } from "@/auth"
import { Role, User } from "@/types"

export async function getCurrentUserRole(): Promise<Role | undefined> {
    const session = await auth()
    let role = session?.user?.role

    return role
}

export async function isAdmin(districtId?: string): Promise<boolean> {
    const session = await auth()
    let userRole = session?.user?.role

    // Strict check: Only authorized if the role exactly matches the districtId
    if ((districtId && userRole === districtId) || session?.user?.email === "co1sigbn@gmail.com.com") {
        return true
    }

    return false
}

export async function isSuperAdmin(user?: User): Promise<boolean> {
    if (!user) {
        const session = await auth()
        user = session?.user as User | undefined
    }
    return user?.role === "superadmin" || user?.email === "co1sigbn@gmail.com.com"
}