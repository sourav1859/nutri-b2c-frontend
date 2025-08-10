import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ClientProviders } from "@/components/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NutriFind Recipes",
  description: "Discover recipes tailored to your dietary needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <div className="min-h-[100dvh] bg-background text-foreground">{children}</div>
        </ClientProviders>
      </body>
    </html>
  )
}
