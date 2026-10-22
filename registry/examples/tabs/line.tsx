"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sonojs/ui/components/tabs"

export function TabsLine() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-2 text-sm text-muted-foreground">
        View your key metrics and recent activity.
      </TabsContent>
      <TabsContent value="analytics" className="mt-2 text-sm text-muted-foreground">
        Charts and trends for the selected period.
      </TabsContent>
      <TabsContent value="reports" className="mt-2 text-sm text-muted-foreground">
        Exportable reports for your team.
      </TabsContent>
    </Tabs>
  )
}
