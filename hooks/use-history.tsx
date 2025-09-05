"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import type { Recipe } from "@/lib/types"
import { apiGetRecentlyViewed, apiLogHistoryView } from "@/lib/api";

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

  const loadRecentRecipes = async () => {
    try {
      const rows = await apiGetRecentlyViewed(20);
      const mapped = rows.map(({ recipe }) => ({
        id: recipe.id,
        title: recipe.title ?? "Untitled",
        imageUrl: recipe.image_url ?? (Array.isArray(recipe.images) ? recipe.images[0] : null),
        prepTime: Number(recipe.prep_time_minutes ?? 0),
        cookTime: Number(recipe.cook_time_minutes ?? 0),
        servings: Number(recipe.servings ?? 1),
        difficulty: (recipe.difficulty ?? "easy") as any,
        tags: [
          ...(Array.isArray(recipe.tags) ? recipe.tags : []),
          ...(Array.isArray(recipe.diet_tags) ? recipe.diet_tags : []),
          ...(Array.isArray(recipe.cuisines) ? recipe.cuisines : []),
          ...(Array.isArray(recipe.flags) ? recipe.flags : []),
        ],
      }));
      setRecentRecipes(mapped);
    } catch (e) {
      console.error("Failed to load recent recipes:", e);
      setRecentRecipes([]);
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      loadRecentRecipes()
    } else {
      setRecentRecipes([])
    }
  }, [history.length]) // Only depend on history.length to avoid infinite loop

const addToHistory = useCallback((entry: string | { id?: string }) => {
  const id = typeof entry === "string" ? entry : entry?.id;
  if (!id) return;

  // Optimistic local update
  const now = new Date().toISOString();
  setHistory(prev => {
    const filtered = prev.filter(i => i.recipeId !== id);
    return [{ recipeId: id, viewedAt: now }, ...filtered].slice(0, 50);
  });

  // Fire-and-forget server log (string only)
  void apiLogHistoryView(id);
}, []);

  const clearHistory = useCallback(() => {
    setHistory([])
    setRecentRecipes([])
  }, []) // Memoize clearHistory

  return (
    <HistoryContext.Provider
    value={{
      history,
      recentRecipes,
      addToHistory,         // <— only the original name
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
