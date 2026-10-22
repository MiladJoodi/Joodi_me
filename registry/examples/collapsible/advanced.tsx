"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sonojs/ui/components/collapsible"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@sonojs/ui/components/field"
import { Input } from "@sonojs/ui/components/input"
import { cn } from "@sonojs/ui/lib/utils"

export function CollapsibleAdvanced() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="w-full max-w-sm rounded-lg border border-border p-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="hook-name">Webhook name</FieldLabel>
          <Input id="hook-name" defaultValue="Production events" />
        </Field>
        <Field>
          <FieldLabel htmlFor="hook-url">Endpoint URL</FieldLabel>
          <Input
            id="hook-url"
            type="url"
            dir="ltr"
            className="text-start"
            defaultValue="https://api.acme.dev/hooks"
          />
        </Field>
      </FieldGroup>

      <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ms-2 gap-1 text-muted-foreground"
          >
            Advanced
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="hook-secret">Signing secret</FieldLabel>
              <Input
                id="hook-secret"
                type="password"
                defaultValue="whsec_••••••••"
                autoComplete="off"
              />
              <FieldDescription>
                Used to verify payloads. Rotate if leaked.
              </FieldDescription>
            </Field>
            <Field className="items-start [&>*]:w-auto">
              <FieldLabel htmlFor="hook-timeout">Timeout (ms)</FieldLabel>
              <Input
                id="hook-timeout"
                type="number"
                defaultValue="5000"
                className="w-24"
              />
            </Field>
          </FieldGroup>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
