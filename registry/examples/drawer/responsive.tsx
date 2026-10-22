"use client"

import * as React from "react"

import { Button } from "@sonojs/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@sonojs/ui/components/drawer"
import { Input } from "@sonojs/ui/components/input"
import { Label } from "@sonojs/ui/components/label"

export function DrawerResponsive() {
  const [goal, setGoal] = React.useState(350)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>
            Set your daily activity goal. Works in both LTR and RTL layouts.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="goal">Goal (calories)</Label>
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(event) => setGoal(Number(event.target.value))}
            />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
