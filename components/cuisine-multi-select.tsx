"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown } from "lucide-react"

export function CuisineMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select cuisines",
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const selectedCount = value.length
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <span className="flex flex-wrap gap-1">
            {selectedCount === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.slice(0, 2).map((v) => (
                <Badge key={v} variant="secondary">
                  {v}
                </Badge>
              ))
            )}
            {selectedCount > 2 && <Badge variant="outline">+{selectedCount - 2}</Badge>}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
        <ul className="max-h-56 overflow-auto space-y-1">
          {options.map((opt) => {
            const checked = value.includes(opt)
            return (
              <li key={opt}>
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full flex items-center gap-2 ..."
                  onClick={() => onChange(checked ? value.filter((v) => v !== opt) : [...value, opt])}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(checked ? value.filter((v) => v !== opt) : [...value, opt]);
                  }}}
                >
                  <Checkbox checked={checked} onCheckedChange={() => {}} aria-hidden="true" />
                  <span className="flex-1 text-left">{opt}</span>
                  {checked && <Check className="h-4 w-4" />}
                </div>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
