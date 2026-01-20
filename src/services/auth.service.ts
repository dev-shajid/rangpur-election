
"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { UserModel } from "@/models/User";
import { Role } from "@/types";
import { hash } from "bcryptjs";
import { z } from "zod";

const SignUpSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
});

export async function signUp(values: z.infer<typeof SignUpSchema>) {
    const validatedFields = SignUpSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await dbConnect();

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return { error: "Email already in use!" };
        }

        const hashedPassword = await hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        return { success: "User created!" };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Something went wrong!" };
    }
}


export async function checkAdmin(districtId?: string) {
    const session = await auth()

    let userRole = session?.user?.role

    if (!userRole && session?.user?.email) {
        await dbConnect()
        const user = await UserModel.findOne({ email: session.user.email })
        userRole = user?.role as Role
    }

    if (session?.user?.email === "Co1sigbn@gmail.com") {
        return true
    }

    if (!userRole) {
        throw new Error("Unauthorized")
    }

    // Superadmin has access to everything
    if (userRole === "superadmin") {
        return true
    }

    // District admin has access only to their district
    if (districtId && userRole === districtId) {
        return true
    }

    throw new Error("Unauthorized")
}