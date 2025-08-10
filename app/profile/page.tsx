"use client"

import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { useUser } from "@/hooks/use-user"

export default function ProfilePage() {
  const { user } = useUser()
  return (
    <div className="pb-16 md:pb-0">
      <AppHeader />
      <main className="container px-4 py-4 space-y-2">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>Name: {user?.name ?? "Guest"}</p>
        <p className="text-muted-foreground text-sm">NextAuth integration placeholder.</p>
      </main>
      <BottomNav />
    </div>
  )
}
