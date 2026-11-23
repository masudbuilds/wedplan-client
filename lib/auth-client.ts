"use client"

import { createAuthClient } from "better-auth/react"
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

// Better Auth Client with JWT Client Plugin and additional fields typing
const rawAppUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")
const baseURL = rawAppUrl.replace(/\/+$/, "")

export const authClient = createAuthClient({
  baseURL,
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
})

export const { useSession, signIn, signUp, signOut, updateUser } = authClient
