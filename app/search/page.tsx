"use client"

import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { useFilters } from "@/hooks/use-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchPage() {
  const { filters, setFilters } = useFilters()
  const [term, setTerm] = useState(filters.q || "")
  const router = useRouter()

  function goHome() {
    setFilters({ ...filters, q: term })
    router.push("/")
  }

  return (
    <div className="pb-16 md:pb-0">
      <AppHeader />
      <main className="container px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold">Search</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search recipes, cuisines..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goHome()}
          />
          <Button onClick={goHome}>Search</Button>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
