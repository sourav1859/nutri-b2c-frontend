"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Recipe } from "@/lib/types"
import { apiGetSaved } from "@/lib/api";

interface FavoritesContextType {
  favorites: string[]
  savedRecipes: Recipe[]
  addFavorite: (recipeId: string) => void
  removeFavorite: (recipeId: string) => void
  isFavorite: (recipeId: string) => boolean
  toggleFavorite: (recipeId: string) => void
  loadSavedRecipes: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("nutrition-app-favorites")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
        setFavorites([])
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nutrition-app-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Load saved recipes data when favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      loadSavedRecipes()
    } else {
      setSavedRecipes([])
    }
  }, [favorites])

  const addFavorite = (recipeId: string) => {
    setFavorites((prev) => (prev.includes(recipeId) ? prev : [...prev, recipeId]))
  }

  const removeFavorite = (recipeId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== recipeId))
  }

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId)
  }

  const toggleFavorite = (recipeId: string) => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId)
    } else {
      addFavorite(recipeId)
    }
  }

  const loadSavedRecipes = async () => {
  try {
    const saved = await apiGetSaved(); // already a Recipe[]
    setSavedRecipes(saved);
  } catch (error) {
    console.error("Failed to load saved recipes:", error);
    setSavedRecipes([]); // fail safe
  }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        savedRecipes,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        loadSavedRecipes,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
