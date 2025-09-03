// components/admin/app-shell.tsx
"use client"

import type React from "react"

import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs"

export default function AdminAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex w-[260px] border-r">
        <AdminSidebar isCollapsed={false} onToggleCollapse={() => {}} />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-4">
            <AdminBreadcrumbs />
          </div>
          <div className="px-4 pb-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
