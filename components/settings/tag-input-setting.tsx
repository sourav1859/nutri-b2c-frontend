"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Props = {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  description?: string
}

export function TagInputSetting({ label, value, onChange, placeholder, description }: Props) {
  const [inputValue, setInputValue] = useState("")

  const addTag = () => {
    const trimmed = inputValue.trim().toLowerCase()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue("")
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add tag..."}
          className="flex-1"
        />
        <Button onClick={addTag} size="sm" disabled={!inputValue.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
