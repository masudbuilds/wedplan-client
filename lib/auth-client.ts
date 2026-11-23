"use client"

import { createAuthClient } from "better-auth/react"
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

// Better Auth Client with JWT Client Plugin and additional fields typing
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : ""),
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
})

export const { useSession, signIn, signUp, signOut, updateUser } = authClient
