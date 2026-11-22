import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { jwt } from "better-auth/plugins"
import { APIError } from "better-auth/api"
import { client, db } from "@/lib/mongodb"

// Better Auth Server Instance Configuration
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "wedplan_super_secret_auth_key_development_only_12345",

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
        input: false, // Prevent client from arbitrary modification via updateUser
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
          const reqBody = (ctx as any)?.body
          const requestedRole = (user as any).role || reqBody?.role

          // Only "vendor" and "customer" are valid; all else (including "admin") becomes "customer".
          const safeRole =
            requestedRole === "vendor" || requestedRole === "customer"
              ? requestedRole
              : "customer"

          const businessName =
            safeRole === "vendor"
              ? reqBody?.businessName || (user as any).businessName || ""
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
          const {
            role,
            isBlocked,
            subscriptionPlan,
            subscriptionExpiresAt,
            ...safeData
          } = user as any

          return {
            data: safeData,
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
