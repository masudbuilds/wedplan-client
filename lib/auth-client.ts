"use client"

import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

// Better Auth Client with JWT Client Plugin
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient()],
})

export const { useSession, signIn, signUp, signOut, updateUser } = authClient
