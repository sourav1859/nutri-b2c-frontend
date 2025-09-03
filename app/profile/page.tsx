"use client"

import { ProfileTabs } from "@/components/profile-tabs"
import { useUser } from "@/hooks/use-user"
import { TEST_MODE } from "@/lib/test-mode"

export default function ProfilePage() {
  const { user, isAuthed } = useUser()

  if (!TEST_MODE && (!isAuthed || !user)) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  const displayUser =
    TEST_MODE && !user
      ? {
          id: "test-user",
          name: "Test User",
          email: "test@example.com",
        }
      : user

  return (
    <div className="container px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and health information</p>
      </div>

      {displayUser && <ProfileTabs user={displayUser} />}
    </div>
  )
}
