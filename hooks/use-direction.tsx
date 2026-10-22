"use client"

/**
 * Re-export the package direction context so docs DirectionProvider and
 * portaled UI (Alert Dialog, Dialog, …) share one React context.
 */
export {
  DirectionContext,
  DirectionContextProvider,
  useDirection,
  useDocumentDirection,
} from "@winkui/ui/hooks/use-direction"
