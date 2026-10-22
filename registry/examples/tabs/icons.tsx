"use client"

import { AppWindowIcon, CodeIcon } from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sonojs/ui/components/tabs"

export function TabsIcons() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon data-icon="inline-start" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon data-icon="inline-start" />
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="mt-2 text-sm text-muted-foreground">
        Live preview of the component.
      </TabsContent>
      <TabsContent value="code" className="mt-2 text-sm text-muted-foreground">
        Source for the current example.
      </TabsContent>
    </Tabs>
  )
}
