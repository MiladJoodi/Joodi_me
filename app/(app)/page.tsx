import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@winkui/ui/components/button"

export default function HomePage() {
  return (
    <div
      data-home-surface=""
      className="relative -mt-(--header-height) flex flex-1 flex-col overflow-hidden pt-(--header-height)"
    >
      {/* Atmosphere extends under the transparent home header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 55% at 50% -10%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%),
            linear-gradient(to bottom, transparent 40%, var(--background) 100%),
            linear-gradient(color-mix(in oklab, var(--foreground) 4%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklab, var(--foreground) 4%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, 48px 48px, 48px 48px",
        }}
      />

      <section className="container-wrapper relative flex min-h-[calc(100svh-var(--header-height)-5rem)] flex-1 flex-col justify-center px-6 py-20 sm:px-10 sm:py-28">
        <p
          className="mb-5 text-[0.8125rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          style={{
            animation: "wink-fade-in var(--motion-fast) var(--motion-ease) both",
          }}
        >
          React · Tailwind · Accessible
        </p>

        <h1
          className="max-w-3xl text-5xl font-extrabold tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl"
          style={{
            animation:
              "wink-fade-up 520ms var(--motion-ease) 60ms both",
          }}
        >
          <span className="text-primary">{siteConfig.name}</span>
        </h1>

        <p
          className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{
            animation:
              "wink-fade-up 520ms var(--motion-ease) 140ms both",
          }}
        >
          {siteConfig.description}
        </p>

        <div
          className="mt-10 flex flex-wrap gap-3"
          style={{
            animation:
              "wink-fade-up 520ms var(--motion-ease) 220ms both",
          }}
        >
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "cursor-pointer"
            )}
          >
            Read the docs
          </Link>
          <Link
            href="/docs/components/button"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "cursor-pointer"
            )}
          >
            Browse components
          </Link>
        </div>
      </section>
    </div>
  )
}
