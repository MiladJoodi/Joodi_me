"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sonojs/ui/components/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@sonojs/ui/components/input-group"

export function InputGroupDropdown() {
  const [prefix, setPrefix] = React.useState("+1")

  return (
    <InputGroup dir="ltr" className="max-w-xs">
      <InputGroupInput
        placeholder="Phone number"
        type="tel"
        className="text-left"
      />
      <InputGroupAddon>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton className="tabular-nums">
              {prefix}
              <ChevronDownIcon className="size-3.5 opacity-60" />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-20">
            <DropdownMenuItem onClick={() => setPrefix("+1")}>
              +1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPrefix("+44")}>
              +44
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPrefix("+98")}>
              +98
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  )
}
