"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, UserRole } from "@/types"
import { useSession, signOut, authClient } from "@/lib/auth-client"

interface AuthContextType {
  user: User | null
  role: UserRole | null
  isLoading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [extraUser, setExtraUser] = React.useState<Partial<User> | null>(null)

  const refreshUser = React.useCallback(async () => {
    try {
      const sessionRes = await authClient.getSession()
      if (sessionRes?.data?.user) {
        const raw = sessionRes.data.user as Record<string, unknown>
        setExtraUser({
          name: String(raw.name || ""),
          image: raw.image ? String(raw.image) : undefined,
          businessName: raw.businessName ? String(raw.businessName) : undefined,
        })
      }
    } catch {
      // Ignore session refresh error
    }
  }, [])

  // Map Better Auth session to WedPlan User interface
  const user: User | null = React.useMemo(() => {
    if (!session?.user) return null

    const rawUser = session.user as Record<string, unknown>
    return {
      id: String(rawUser.id || ""),
      name: extraUser?.name ?? String(rawUser.name || ""),
      email: String(rawUser.email || ""),
      image:
        extraUser?.image !== undefined
          ? extraUser.image
          : rawUser.image
          ? String(rawUser.image)
          : undefined,
      role: (rawUser.role as UserRole) || "customer",
      isBlocked: Boolean(rawUser.isBlocked),
      businessName:
        extraUser?.businessName !== undefined
          ? extraUser.businessName
          : rawUser.businessName
          ? String(rawUser.businessName)
          : undefined,
      subscriptionPlan: (rawUser.subscriptionPlan as "free" | "premium") || "free",
      subscriptionExpiresAt: rawUser.subscriptionExpiresAt
        ? String(rawUser.subscriptionExpiresAt)
        : undefined,
      createdAt: rawUser.createdAt ? String(rawUser.createdAt) : undefined,
    }
  }, [session, extraUser])

  const logout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading: isPending,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}
