"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sonojs/ui/components/tabs"

export function TabsDisabled() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password
        </TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-2 text-sm text-muted-foreground">
        Account settings are available.
      </TabsContent>
      <TabsContent value="billing" className="mt-2 text-sm text-muted-foreground">
        Manage your billing details.
      </TabsContent>
    </Tabs>
  )
}
