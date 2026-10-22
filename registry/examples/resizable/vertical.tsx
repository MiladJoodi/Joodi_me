"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@sonojs/ui/components/resizable"

export function ResizableVertical() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize="40%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-medium">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="60%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-medium">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
