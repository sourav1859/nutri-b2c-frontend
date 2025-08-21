// lib/admin/audit.ts
const KEY = "admin_audit_v1"

export type AuditEntry = {
  ts: string
  actor: string
  action: string
  target?: string
  summary?: string
  diff?: any
}

export function listAudit(): AuditEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function appendAudit(entry: AuditEntry) {
  const all = listAudit()
  all.unshift(entry)
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 500)))
}
