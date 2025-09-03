// components/role-guard.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"

export function RoleGuard({
  required = "admin",
  children,
}: {
  required?: "admin" | "user"
  children: React.ReactNode
}) {
  const { isAuthed, user } = useUser()
  const router = useRouter()
  const role = user?.role ?? "user"

  useEffect(() => {
    if (!isAuthed) {
      router.replace("/login")
      return
    }
    if (required === "admin" && role !== "admin") {
      router.replace("/") // or a 403 page if you prefer
    }
  }, [isAuthed, role, required, router])

  if (!isAuthed) return null
  if (required === "admin" && role !== "admin") return null
  return <>{children}</>
}
