"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import type { Recipe } from "@/lib/types"

interface HistoryItem {
  recipeId: string
  viewedAt: string
}

interface HistoryContextType {
  history: HistoryItem[]
  recentRecipes: Recipe[]
  addToHistory: (recipeId: string) => void
  clearHistory: () => void
  loadRecentRecipes: () => Promise<void>
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("nutrition-app-history")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setHistory(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error)
        setHistory([])
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nutrition-app-history", JSON.stringify(history))
  }, [history])

  const historyRef = useRef(history)
  historyRef.current = history

  const loadRecentRecipes = useCallback(async () => {
    try {
      // Mock API call - in real app this would fetch from backend
      const response = await fetch("/api/v1/recipes")
      const allRecipes: Recipe[] = await response.json()

      const currentHistory = historyRef.current

      // Get unique recipe IDs from history (most recent first)
      const recentIds = [...new Set(currentHistory.map((item) => item.recipeId))]

      // Filter and sort recipes by history order
      const recent = recentIds
        .map((id) => allRecipes.find((recipe) => recipe.id === id))
        .filter((recipe): recipe is Recipe => recipe !== undefined)
        .slice(0, 20) // Limit to 20 most recent

      setRecentRecipes(recent)
    } catch (error) {
      console.error("Failed to load recent recipes:", error)
      setRecentRecipes([])
    }
  }, []) // Remove history dependency to prevent infinite loop

  useEffect(() => {
    if (history.length > 0) {
      loadRecentRecipes()
    } else {
      setRecentRecipes([])
    }
  }, [history.length]) // Only depend on history.length to avoid infinite loop

  const addToHistory = useCallback((recipeId: string) => {
    const now = new Date().toISOString()
    setHistory((prev) => {
      // Remove existing entry for this recipe
      const filtered = prev.filter((item) => item.recipeId !== recipeId)
      // Add to beginning of array
      const updated = [{ recipeId, viewedAt: now }, ...filtered]
      // Keep only last 50 items
      return updated.slice(0, 50)
    })
  }, []) // Memoize addToHistory to prevent unnecessary re-renders

  const clearHistory = useCallback(() => {
    setHistory([])
    setRecentRecipes([])
  }, []) // Memoize clearHistory

  return (
    <HistoryContext.Provider
      value={{
        history,
        recentRecipes,
        addToHistory,
        clearHistory,
        loadRecentRecipes,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
