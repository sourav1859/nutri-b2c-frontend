// components/admin/breadcrumbs.tsx
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const adminSegments = segments.slice(1) // drop "admin"
  const breadcrumbs = [{ label: "Admin", href: "/admin" }]

  let currentPath = "/admin"
  adminSegments.forEach((segment) => {
    currentPath += `/${segment}`
    const label = segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    breadcrumbs.push({ label, href: currentPath })
  })

  return (
    <nav className="flex items-center text-sm text-muted-foreground gap-2">
      {breadcrumbs.map((bc, idx) => (
        <React.Fragment key={bc.href}>
          {idx > 0 && <ChevronRight className="h-4 w-4" />}
          <Link href={bc.href} className={cn(idx === breadcrumbs.length - 1 && "text-foreground")}>
            {bc.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}
