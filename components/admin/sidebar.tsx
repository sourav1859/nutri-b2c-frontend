// components/admin/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  BarChart3,
  Flag,
  Users,
  Tag,
  PackageOpen,
  Megaphone,
  Shield,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const NAV = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { title: "Recipes", href: "/admin/content/recipes", icon: BookOpen },
      { title: "Products", href: "/admin/content/products", icon: PackageOpen },
      { title: "Collections", href: "/admin/content/collections", icon: Tag },
      { title: "Taxonomies", href: "/admin/taxonomy/dictionary", icon: Globe },
      { title: "Synonyms", href: "/admin/taxonomy/synonyms", icon: BookOpen },
    ],
  },
  {
    title: "Users",
    items: [
      { title: "Consumers", href: "/admin/users/consumers", icon: Users },
      { title: "Flags/Reports", href: "/admin/users/flags", icon: Flag },
    ],
  },
  {
    title: "Recommendations",
    items: [{ title: "Global Defaults", href: "/admin/recommendations/defaults", icon: Settings }],
  },
  {
    title: "Operations",
    items: [
      { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { title: "Audit", href: "/admin/audit", icon: Shield },
    ],
  },
]

export function AdminSidebar({ isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {!isCollapsed && <span className="font-semibold text-sm text-muted-foreground">ADMIN</span>}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="md:hidden">
          ☰
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-2 py-3">
          {NAV.map((section) => (
            <div key={section.title} className="mb-4">
              {!isCollapsed && <div className="px-2 pb-2 text-xs font-semibold text-muted-foreground">{section.title}</div>}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} className="block">
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                          active && "bg-accent text-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
