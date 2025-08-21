"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface UnsavedChangesPromptProps {
  hasUnsavedChanges: boolean
}

export function UnsavedChangesPrompt({ hasUnsavedChanges }: UnsavedChangesPromptProps) {
  const router = useRouter()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    const handleRouteChange = () => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave this page?")
        if (!confirmed) {
          throw "Route change aborted"
        }
      }
    }

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload)
      // Note: Next.js App Router doesn't have a built-in way to intercept route changes
      // This is a simplified implementation for the demo
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  return null
}
