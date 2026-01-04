
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

    // Strict check: User role must exactly match the districtId for data management
    if (!userRole || userRole !== districtId) {
        throw new Error("Unauthorized")
    }

    return true
}