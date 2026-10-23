"use client"

import * as React from "react"
import type { ToasterProps } from "sonner"

import { Toaster } from "@/components/ui/sonner"

import { usePreviewDirection } from "./preview-direction"

/**
 * Root docs Toaster — follows the active VariantPreview LTR/RTL toggle so
 * portaled toasts match the demo DirectionProvider.
 */
export function DocsToaster(props: ToasterProps) {
  const previewDir = usePreviewDirection()

  return <Toaster {...props} dir={previewDir ?? props.dir} />
}
