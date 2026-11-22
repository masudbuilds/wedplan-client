"use client"

import * as React from "react"
import { User, UserRole } from "@/types"

interface AuthContextType {
  user: User | null
  role: UserRole | null
  loginAs: (role: UserRole) => void
  logout: () => void
}

// Sample users for local design testing and preview
export const MOCK_USERS: Record<UserRole, User> = {
  customer: {
    id: "cust-1",
    name: "Eleanor Vance",
    email: "eleanor@example.com",
    role: "customer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  vendor: {
    id: "vend-1",
    name: "Julian & Co. Photography",
    email: "julian@weddings.com",
    role: "vendor",
    businessName: "Julian & Co. Photography",
    subscriptionPlan: "premium",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  admin: {
    id: "adm-1",
    name: "WedPlan Admin",
    email: "admin@wedplan.com",
    role: "admin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  loginAs: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to null (logged out) or test session
  const [user, setUser] = React.useState<User | null>(null)

  const loginAs = (role: UserRole) => {
    setUser(MOCK_USERS[role])
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loginAs,
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
