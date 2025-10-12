// app/admin/audit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { listAudit, type AuditEntry } from "@/lib/admin/audit"

export const dynamic = 'force-dynamic'

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])

  useEffect(() => {
    setEntries(listAudit())
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Audit Log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.length === 0 ? (
            <div className="text-muted-foreground">No entries yet</div>
          ) : (
            entries.map((e, i) => (
              <div key={i} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{e.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.actor} • {new Date(e.ts).toLocaleString()}
                  </div>
                </div>
                {e.summary && <div className="text-sm">{e.summary}</div>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
