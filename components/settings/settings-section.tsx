import type { ReactNode } from "react"

type Props = {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
