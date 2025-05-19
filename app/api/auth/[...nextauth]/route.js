// 'use client';

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Create the NextAuth configuration and handler with increased timeouts
const handler = NextAuth({
  debug: true, // Keep debug enabled
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Add the following options to increase timeouts
      httpOptions: {
        timeout: 10000, // Increase timeout to 10 seconds (from default 3.5s)
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Simplified email checking
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()) || [];
      const isAllowed = allowedEmails.includes(user.email);

      console.log("Auth attempt:", {
        email: user.email,
        isAllowed: isAllowed
      });

      return isAllowed;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

// Export the handler methods
export { handler as GET, handler as POST };