"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sonojs/ui/components/tabs"

export function TabsVertical() {
  return (
    <Tabs
      defaultValue="account"
      orientation="vertical"
      className="w-full max-w-lg flex-row"
    >
      <TabsList variant="line" className="shrink-0">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-sm text-muted-foreground">
        Make changes to your account here. The active line sits on the inline
        end of the trigger list.
      </TabsContent>
      <TabsContent value="password" className="text-sm text-muted-foreground">
        Change your password here.
      </TabsContent>
      <TabsContent
        value="notifications"
        className="text-sm text-muted-foreground"
      >
        Configure how you receive alerts.
      </TabsContent>
    </Tabs>
  )
}
