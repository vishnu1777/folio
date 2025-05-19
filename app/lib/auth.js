import { NextAuthOptions } from "@auth/core";
import GoogleProvider from "next-auth/providers/google";

// Function to check if email is in allowed list
const isAllowedEmail = (email) => {
    const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
    return allowedEmails.includes(email);
};

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Only allow specific emails
            return isAllowedEmail(user.email);
        },
        async session({ session }) {
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
};