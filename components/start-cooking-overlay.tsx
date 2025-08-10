"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function StartCookingOverlay({
  open,
  onOpenChange,
  steps,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  steps: string[]
}) {
  const [index, setIndex] = useState(0)
  function next() {
    setIndex((i) => Math.min(i + 1, steps.length - 1))
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0))
  }
  function close() {
    setIndex(0)
    onOpenChange(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) close()
        else onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-2xl h-[90vh] sm:h-auto sm:min-h-[400px]">
        <DialogHeader>
          <DialogTitle>Cooking Mode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-center justify-center text-center gap-6 py-4">
          <div className="text-6xl font-bold tabular-nums">
            {index + 1}/{steps.length}
          </div>
          <p className="text-lg">{steps[index]}</p>
          <div className="flex items-center gap-2">
            <Button onClick={prev} variant="outline" disabled={index === 0}>
              Previous
            </Button>
            {index < steps.length - 1 ? (
              <Button onClick={next}>Next Step</Button>
            ) : (
              <Button onClick={close}>Finish</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
