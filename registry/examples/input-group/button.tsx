"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@sonojs/ui/components/input-group"

export function InputGroupButtonExample() {
  const [copied, setCopied] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Search">
            <SearchIcon />
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          defaultValue="npm install @sonojs/ui"
          readOnly
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={copied ? "Copied" : "Copy"}
            onClick={() => {
              void navigator.clipboard.writeText("npm install @sonojs/ui")
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
