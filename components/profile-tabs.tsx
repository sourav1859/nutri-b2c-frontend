"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileOverview } from "@/components/profile-overview"
import { ProfileHealth } from "@/components/profile-health"
import { ProfileSecurity } from "@/components/profile-security"
import type { User } from "@/lib/mock-auth"

interface ProfileTabsProps {
  user: User
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <ProfileOverview user={user} />
      </TabsContent>

      <TabsContent value="health" className="mt-6">
        <ProfileHealth user={user} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <ProfileSecurity user={user} />
      </TabsContent>
    </Tabs>
  )
}
