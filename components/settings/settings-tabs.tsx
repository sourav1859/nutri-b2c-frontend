import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReactNode } from "react"

interface SettingsTab {
  id: string
  label: string
  content: ReactNode
}

interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultTab?: string
}

export function SettingsTabs({ tabs, defaultTab }: SettingsTabsProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.id} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="text-xs px-2">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
