import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { jwt } from "better-auth/plugins"
import { APIError } from "better-auth/api"
import { client, db } from "@/lib/mongodb"

// Better Auth Server Instance Configuration
const rawBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  ""
const baseURL = rawBaseUrl.replace(/\/+$/, "")

const rawOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => origin.replace(/\/+$/, ""))

const trustedOrigins = Array.from(new Set(rawOrigins))

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  secret: process.env.BETTER_AUTH_SECRET || "",

  // MongoDB Database Adapter with plural collection names ("users", "sessions")
  database: mongodbAdapter(db, {
    client,
    usePlural: true,
    transaction: false,
  }),

  // Email and Password Credentials Authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Google OAuth Social Provider
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },

  // JWT Plugin with JWKS endpoint at /api/auth/jwks for Express server token verification
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
        },
      },
    }),
  ],

  // Extra user fields according to WedPlan specifications
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  // Database security hooks
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Security Rule: Admin can NEVER be created through public registration.
          // Read requested role from context body if provided during sign up.
          const reqBody = (ctx as { body?: Record<string, unknown> })?.body
          const userRec = user as Record<string, unknown>
          const requestedRole = userRec.role || reqBody?.role

          // Only "vendor" and "customer" are valid; all else (including "admin") becomes "customer".
          const safeRole =
            requestedRole === "vendor" || requestedRole === "customer"
              ? requestedRole
              : "customer"

          const businessName =
            safeRole === "vendor"
              ? (reqBody?.businessName as string) ||
                (userRec.businessName as string) ||
                ""
              : undefined

          return {
            data: {
              ...user,
              role: safeRole,
              businessName,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          }
        },
      },
      update: {
        before: async (user) => {
          // Security Rule: Prevent updating role, isBlocked, or subscription via profile updates
          const userRec = user as Record<string, unknown>
          delete userRec.role
          delete userRec.isBlocked
          delete userRec.subscriptionPlan
          delete userRec.subscriptionExpiresAt

          return {
            data: userRec,
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // Security Rule: Blocked users must not be able to sign in or obtain a session
          try {
            const userRecord = await db
              .collection("users")
              .findOne({ id: session.userId })

            if (userRecord?.isBlocked) {
              throw new APIError("UNAUTHORIZED", {
                message:
                  "Your account has been suspended. Please contact platform administrators.",
              })
            }
          } catch (err) {
            if (err instanceof APIError) throw err
            // If DB check fails, continue
          }

          return {
            data: session,
          }
        },
      },
    },
  },
})
