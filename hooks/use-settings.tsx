"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { RecommendationSettings } from "@/lib/types"
import { loadSettings, saveSettings, resetSettings, downloadSettingsJson, DEFAULT_SETTINGS } from "@/lib/settings"

type SettingsContextType = {
  settings: RecommendationSettings
  setSettings: (settings: RecommendationSettings) => void
  updateSettings: (partial: Partial<RecommendationSettings>) => void
  apply: () => void
  resetToDefaults: () => void
  downloadJson: () => void
  isLoading: boolean
  hasUnsavedChanges: boolean
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<RecommendationSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const loaded = loadSettings()
    setSettingsState(loaded)
    setIsLoading(false)
  }, [])

  const setSettings = (newSettings: RecommendationSettings) => {
    setSettingsState(newSettings)
    setHasUnsavedChanges(true)
  }

  const updateSettings = (partial: Partial<RecommendationSettings>) => {
    const updated = { ...settings, ...partial }
    setSettings(updated)
  }

  const apply = () => {
    saveSettings(settings)
    setHasUnsavedChanges(false)
    // Show toast notification (will be handled by UI components)
  }

  const resetToDefaults = () => {
    const defaults = resetSettings()
    setSettingsState(defaults)
    setHasUnsavedChanges(false)
  }

  const downloadJson = () => {
    downloadSettingsJson(settings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        updateSettings,
        apply,
        resetToDefaults,
        downloadJson,
        isLoading,
        hasUnsavedChanges,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
