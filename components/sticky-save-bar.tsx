"use client"

import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickySaveBarProps {
  onSave: () => void
  onCancel: () => void
  hasUnsavedChanges: boolean
  className?: string
}

export function StickySaveBar({ onSave, onCancel, hasUnsavedChanges, className }: StickySaveBarProps) {
  if (!hasUnsavedChanges) return null

  return (
    <div className={cn("fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <div className="bg-background border rounded-lg shadow-lg p-3 flex items-center gap-3">
        <span className="text-sm font-medium">You have unsaved changes</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
