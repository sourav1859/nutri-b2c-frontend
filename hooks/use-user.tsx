"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email?: string
  image?: string
}

type UserContextValue = {
  user: User | null
  signOut: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  // Mocked user until NextAuth integration is added
  const [user, setUser] = useState<User | null>({ id: "u_1", name: "Alex" })

  const value = useMemo(
    () => ({
      user,
      signOut: () => setUser(null),
    }),
    [user],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
