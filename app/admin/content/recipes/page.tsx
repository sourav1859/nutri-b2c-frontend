// app/admin/content/recipes/page.tsx
"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"
import DataTable from "@/components/admin/data-table" // default export works too

// Adjust the path if yours differs
import recipesAdmin from "@/app/_mock/admin/recipes-admin.json"

// ----- Types ---------------------------------------------------------------

type PublishStatus = "draft" | "review" | "published"
type Difficulty = "easy" | "medium" | "hard"

export type RecipeAdminRow = {
  id: string
  title: string
  status: PublishStatus
  updatedAt: number | string
  views: number
  saves: number
  difficulty: Difficulty
  timeMins: number
  servings: number
}

const columns = [
  { key: "title", label: "Title", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (v: PublishStatus) => {
      const variant =
        v === "published" ? "default" : v === "review" ? "secondary" : "outline"
      return <Badge variant={variant as any}>{v}</Badge>
    },
  },
  {
    key: "updatedAt",
    label: "Updated",
    sortable: true,
    render: (v: number | string) => {
      const d = typeof v === "number" ? new Date(v) : new Date(String(v))
      return d.toLocaleDateString()
    },
  },
  { key: "views", label: "Views", sortable: true },
  { key: "saves", label: "Saves", sortable: true },
  {
    key: "difficulty",
    label: "Difficulty",
    sortable: true,
    render: (v: Difficulty) => <Badge variant="outline">{v}</Badge>,
  },
  {
    key: "timeMins",
    label: "Time",
    sortable: true,
    render: (v: number) => (
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" /> {v}m
      </span>
    ),
  },
  {
    key: "servings",
    label: "Servings",
    sortable: true,
    render: (v: number) => (
      <span className="inline-flex items-center gap-1">
        <Users className="h-3 w-3" /> {v}
      </span>
    ),
  },
] as const

// ----- Page ----------------------------------------------------------------

export default function AdminRecipesPage() {
  // Robustly read mock data whether it's an array or {recipes: []}
  const rows = useMemo<RecipeAdminRow[]>(() => {
    const raw: any = recipesAdmin as any
    const arr: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.recipes) ? raw.recipes : []
    return arr.map((r) => ({
      id: String(r.id ?? r._id ?? crypto.randomUUID()),
      title: r.title ?? "Untitled",
      status: (r.status ?? "draft") as PublishStatus,
      updatedAt: r.updatedAt ?? r.updated ?? Date.now(),
      views: Number(r.views ?? 0),
      saves: Number(r.saves ?? r.favorites ?? 0),
      difficulty: (r.difficulty ?? "easy") as RecipeAdminRow["difficulty"],
      timeMins: Number(r.timeMins ?? r.time ?? 0),
      servings: Number(r.servings ?? 0),
    }))
  }, [])

  const [selected, setSelected] = useState<RecipeAdminRow[]>([])
  const [sortKey, setSortKey] = useState<keyof RecipeAdminRow>("updatedAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [isLoading] = useState(false)

  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a: any, b: any) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === bv) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return sortDir === "asc" ? -1 : 1
    })
    return list
  }, [rows, sortKey, sortDir])

  function toggleRow(row: RecipeAdminRow) {
    setSelected((prev) => {
      const exists = prev.find((r) => r.id === row.id)
      return exists ? prev.filter((r) => r.id !== row.id) : [...prev, row]
    })
  }

  function onToggleAll(checked: boolean) {
    setSelected(checked ? sorted : [])
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Recipes</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Export CSV</Button>
          <Button size="sm">New Recipe</Button>
        </div>
      </div>

      <DataTable<RecipeAdminRow>
        columns={columns as any}
        data={sorted}
        selectedRows={selected}
        onToggleRow={toggleRow}
        onToggleAll={onToggleAll}
        onSort={(k: keyof RecipeAdminRow, d: "asc" | "desc") => {
          setSortKey(k)
          setSortDir(d)
        }}
        sortKey={sortKey}
        sortDirection={sortDir}
        isLoading={isLoading}
      />
    </div>
  )
}
