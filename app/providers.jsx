'use client';
import React from "react"; // Add this import
import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}