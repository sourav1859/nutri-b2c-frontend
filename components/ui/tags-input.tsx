"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Props = {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function TagsInput({ label, value, onChange, placeholder }: Props) {
  const [text, setText] = React.useState("");

  function addTag(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(text);
      setText("");
    }
  }

  return (
    <div className="grid gap-2">
      {label ? <div className="text-sm font-medium">{label}</div> : null}

      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <Badge key={`${t}-${i}`} variant="secondary" className="gap-1">
            {t}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            />
          </Badge>
        ))}
      </div>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? "Type and press Enter"}
      />
    </div>
  );
}
