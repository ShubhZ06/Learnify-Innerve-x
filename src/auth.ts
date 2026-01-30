import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import UserModel from "./models/User";
import bcrypt from "bcryptjs";

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

                await connectDB();

                const user = await UserModel.findOne({
                    email: credentials.email,
                });

                if (!user || !user.password) {
                    //   throw new Error("User not found.");
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordCorrect) {
                    //   throw new Error("Invalid credentials.");
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                } as User & { role: string; id: string };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
});
