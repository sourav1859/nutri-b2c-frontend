"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, AlertTriangle, CheckCircle } from "lucide-react"
import type { AnalyzeResult } from "@/lib/types"

export function AllergensCard({ result, onEdit }: { result: any; onEdit?: (r: AnalyzeResult)=>void }) {
  const has = (result.allergens || []).length > 0
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {has ? <AlertTriangle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />} Allergens
        </CardTitle>
        {onEdit && <Button variant="ghost" size="sm" onClick={()=>onEdit(result)}><Edit className="h-4 w-4"/></Button>}
      </CardHeader>
      <CardContent>
        {has ? (
          <div className="flex flex-wrap gap-2">{result.allergens.map((a: string)=> <Badge key={a} variant="secondary">{a}</Badge>)}</div>
        ) : (
          <p className="text-sm text-muted-foreground">No common allergens detected.</p>
        )}
      </CardContent>
    </Card>
  )
}
