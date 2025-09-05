"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import type { Recipe } from "@/lib/types"
import { apiGetSaved, apiToggleSave } from "@/lib/api";

interface FavoritesContextType {
  favorites: string[];
  savedRecipes: Recipe[];
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => Promise<void>;
  loadSavedRecipes: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(new Set());
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const isFavorite = useCallback((id: string) => favoritesSet.has(id), [favoritesSet]);

  const addFavorite = useCallback((id: string) => {
    setFavoritesSet(prev => new Set(prev).add(id));
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoritesSet(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    // optimistic flip
    const was = isFavorite(id);
    if (was) removeFavorite(id); else addFavorite(id);

    try {
      const { isSaved } = await apiToggleSave(id);
      // reconcile with server
      if (isSaved) addFavorite(id); else removeFavorite(id);
    } catch (e) {
      // revert on error
      if (was) addFavorite(id); else removeFavorite(id);
      console.error("toggleFavorite failed", e);
    }
  }, [addFavorite, removeFavorite, isFavorite]);

  const loadSavedRecipes = useCallback(async () => {
    const list = await apiGetSaved();         // returns Recipe[]
    setSavedRecipes(list);
    setFavoritesSet(new Set(list.map(r => r.id)));
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: Array.from(favoritesSet),
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
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
