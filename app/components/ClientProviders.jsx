"use client";

import { NextAuthProvider } from "../providers";

export default function ClientProviders({ children }) {
    return <NextAuthProvider>{children}</NextAuthProvider>;
}