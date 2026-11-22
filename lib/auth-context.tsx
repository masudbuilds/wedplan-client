"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, UserRole } from "@/types"
import { authClient, useSession, signOut } from "@/lib/auth-client"

interface AuthContextType {
  user: User | null
  role: UserRole | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Map Better Auth session to WedPlan User interface
  const user: User | null = React.useMemo(() => {
    if (!session?.user) return null

    const rawUser = session.user as any
    return {
      id: rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      image: rawUser.image || undefined,
      role: (rawUser.role as UserRole) || "customer",
      isBlocked: Boolean(rawUser.isBlocked),
      businessName: rawUser.businessName,
      subscriptionPlan: rawUser.subscriptionPlan || "free",
      subscriptionExpiresAt: rawUser.subscriptionExpiresAt,
      createdAt: rawUser.createdAt,
    }
  }, [session])

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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}
