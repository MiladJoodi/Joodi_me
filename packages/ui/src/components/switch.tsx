"use client"

import * as React from "react"
import { useDirection } from "@sonojs/ui/hooks/use-direction"
import { cn } from "@sonojs/ui/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  dir: dirProp,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  const { dir: dirCtx } = useDirection()
  const dir = dirProp ?? dirCtx

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      dir={dir}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Logical `start` flips with dir — checked travels to inline end in LTR and RTL.
          "pointer-events-none absolute top-1/2 block -translate-y-1/2 rounded-full bg-background ring-0 transition-[inset-inline-start] group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 start-0.5 data-[state=checked]:start-[calc(100%-var(--switch-thumb)-2px)] group-data-[size=default]/switch:[--switch-thumb:1rem] group-data-[size=sm]/switch:[--switch-thumb:0.75rem] dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
