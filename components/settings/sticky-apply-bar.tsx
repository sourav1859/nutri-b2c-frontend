"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Props = {
  onApply: () => void
  onReset: () => void
  hasChanges?: boolean
}

export function StickyApplyBar({ onApply, onReset, hasChanges = true }: Props) {
  return (
    <div className="sticky bottom-0 bg-background border-t p-4 -mx-4 -mb-4">
      <Separator className="mb-4" />
      <div className="flex gap-3">
        <Button onClick={onApply} disabled={!hasChanges} className="flex-1">
          Apply Changes
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
