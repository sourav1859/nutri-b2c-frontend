"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function ToggleSetting({ label, checked, onChange, description }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
