"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { FiltersProvider } from "@/hooks/use-filters"
import { UserProvider } from "@/hooks/use-user"

export function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <FiltersProvider>
            {children}
            <Toaster />
          </FiltersProvider>
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
