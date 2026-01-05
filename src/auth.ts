import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import dbConnect from "@/lib/db"
import { UserModel } from "@/models/User"
import { User, Role } from "@/types"


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();
                const user = await UserModel.findOne({ email: credentials.email, role: { $exists: true } }).select("+password")

                if (!user || !user.password) return null;

                const passwordsMatch = await compare(String(credentials?.password), user.password);
                if (passwordsMatch) {
                    if (!user.role) {
                        throw new Error("AccessDenied");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role as Role,
                    };
                }

                // Add explicit return for when passwords don't match
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            const typedUser = user as User | undefined;

            if (typedUser) {
                token.id = typedUser.id;
                token.role = typedUser.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
})