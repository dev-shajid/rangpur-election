'use server'

import { auth } from "@/auth"
import { Role } from "@/types"

export async function getCurrentUserRole(): Promise<Role | undefined> {
    const session = await auth()
    let role = session?.user?.role

    return role
}

export async function isAdmin(districtId?: string): Promise<boolean> {
    const session = await auth()
    let userRole = session?.user?.role

    // Strict check: Only authorized if the role exactly matches the districtId
    if (districtId && userRole === districtId) {
        return true
    }

    return false
}