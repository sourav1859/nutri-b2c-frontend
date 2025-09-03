"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

type Props = {
  label: string
  value: [number, number]
  onChange: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  description?: string
}

export function RangeSetting({ label, value, onChange, min = 0, max = 100, step = 1, unit, description }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
            {value[0]} - {value[1]}
          </span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </div>
      <Slider value={value} onValueChange={onChange} min={min} max={max} step={step} className="w-full" />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
