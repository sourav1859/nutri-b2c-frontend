// components/admin/admin-guard.tsx
"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthed, isAdmin } = useUser()
  const router = useRouter()

  const isAdminBool = useMemo(
    () => (typeof isAdmin === "function" ? Boolean(isAdmin()) : Boolean(isAdmin)),
    [isAdmin],
  )

  useEffect(() => {
    if (loading) return
    if (!isAuthed) {
      router.replace("/login?next=/admin")
      return
    }
    if (!isAdminBool) {
      router.replace("/") // or a 403 page
    }
  }, [loading, isAuthed, isAdminBool, router])

  if (loading || !isAuthed || !isAdminBool) return null
  return <>{children}</>
}
