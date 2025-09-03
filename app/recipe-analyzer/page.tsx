"use client"

import { useEffect, useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { SourceForm } from "@/components/analyzer/source-form"
import { ResultPanel } from "@/components/analyzer/result-panel"
import { analyzeRecipe } from "@/lib/analyze"
import type { AnalyzeResult } from "@/lib/types"

export type SourceType = "paste" | "link" | "photo" | "barcode" | "live"

export interface SourceData {
  type: SourceType
  rawText?: string
  imageUrl?: string
  barcode?: string
}

const STORAGE_KEY = "recipe_analyzer_state_v1"

export default function RecipeAnalyzerPage() {
  const [source, setSource] = useState<SourceData>({ type: "paste", rawText: "" })
  const [result, setResult] = useState<AnalyzeResult>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // restore previous session
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const { source, result } = JSON.parse(saved)
          if (source) setSource(source)
          if (result) setResult(result)
        } catch {}
      }
    }
  }, [])

  const handleAnalyze = async () => {
    const text = (source.rawText || "").trim()
    if (!text) return
    setIsAnalyzing(true)
    try {
      const analyzed = await analyzeRecipe(text)
      setResult(analyzed)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ source, result: analyzed }))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExport = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "recipe-analysis.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenInBuilder = () => {
    if (!result) return
    // seed the builder draft (localStorage only; no backend change)
    const builderData = {
      id: `draft_${Date.now()}`,
      title: result.title || "Untitled",
      description: result.summary || "",
      servings: result.servings || 1,
      ingredients: result.ingredients,
      steps: result.steps || [],
      currentStep: "meta" as const,
      isDirty: true,
    }
    localStorage.setItem("recipe_builder_draft_v1", JSON.stringify(builderData))
    window.location.href = "/recipes/build"
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recipe Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Analyze recipes from text, links, photos, or barcodes to get nutrition, allergens, and tips.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)] min-h-[600px]">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
          <ResizablePanel defaultSize={40} minSize={30}>
            <SourceForm source={source} onChange={setSource} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60} minSize={40}>
            <ResultPanel
              result={result}
              loading={isAnalyzing}
              onEdit={setResult}
              onExport={handleExport}
              onOpenInBuilder={handleOpenInBuilder}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
