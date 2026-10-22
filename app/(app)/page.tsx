import Link from "next/link"

import { CopyButton } from "@/components/docs"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@sonojs/ui/components/button"

const steps = [
  {
    n: "1",
    text: siteConfig.mcpInitCommand,
    kind: "command" as const,
  },
  {
    n: "2",
    text: "Reload your agent",
    kind: "plain" as const,
  },
  {
    n: "3",
    text: "Build a login form with SonoJS",
    kind: "prompt" as const,
  },
]

export default function HomePage() {
  return (
    <div
      data-home-surface=""
      className="relative -mt-(--header-height) flex flex-1 flex-col overflow-hidden pt-(--header-height)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 55% at 50% -10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 58%),
            radial-gradient(ellipse 40% 30% at 85% 60%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 70%),
            linear-gradient(to bottom, transparent 42%, var(--background) 100%),
            linear-gradient(color-mix(in oklab, var(--foreground) 3.5%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklab, var(--foreground) 3.5%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, auto, 48px 48px, 48px 48px",
        }}
      />

      <section className="container-wrapper relative flex min-h-[calc(100svh-var(--header-height)-5rem)] flex-1 flex-col justify-center px-6 py-20 sm:px-10 sm:py-28">
        <p
          className="mb-5 text-[0.8125rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
          style={{
            animation: "sono-fade-in var(--motion-fast) var(--motion-ease) both",
          }}
        >
          Agent-friendly
        </p>

        <h1
          className="max-w-3xl"
          style={{
            animation: "sono-fade-up 520ms var(--motion-ease) 60ms both",
          }}
        >
          {/* Temporary logo test — replace with final brand mark later */}
          <img
            src="/images/logos/01.webp"
            alt={siteConfig.name}
            className="h-14 w-auto sm:h-16 md:h-20"
          />
        </h1>

        <p
          className="mt-5 max-w-sm text-base leading-snug text-muted-foreground sm:text-lg"
          style={{
            animation: "sono-fade-up 520ms var(--motion-ease) 120ms both",
          }}
        >
          Hook up MCP. Then just ask.
        </p>

        <div
          className="relative mt-9 w-full max-w-xl"
          style={{
            animation: "sono-fade-up 520ms var(--motion-ease) 180ms both",
          }}
        >
          <span
            aria-hidden
            className="absolute start-[0.875rem] top-3.5 bottom-3.5 w-px -translate-x-1/2 bg-border rtl:translate-x-1/2"
          />
          <ol className="flex flex-col gap-2.5">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="relative flex items-center gap-3 text-start"
                style={{
                  animation: `sono-fade-up 480ms var(--motion-ease) ${200 + i * 70}ms both`,
                }}
              >
                <span
                  aria-hidden
                  className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] font-semibold text-foreground shadow-[0_0_0_4px_var(--background)]"
                >
                  {step.n}
                </span>

                {step.kind === "command" ? (
                  <div className="flex h-9 min-w-0 flex-1 items-center justify-between gap-2 rounded-[var(--radius-code)] border border-[color:var(--code-border)] bg-[color:var(--code-bg)] ps-3 pe-1.5">
                    <code className="min-w-0 truncate font-mono text-[13px] leading-none text-[color:var(--code-fg)]">
                      <span className="text-[color:var(--code-syntax-comment)] select-none">
                        ${" "}
                      </span>
                      {step.text}
                    </code>
                    <CopyButton value={step.text} className="shrink-0" />
                  </div>
                ) : step.kind === "prompt" ? (
                  <div className="flex h-9 min-w-0 flex-1 items-center rounded-[var(--radius-code)] border border-border/80 bg-muted/40 ps-3 pe-3">
                    <p className="min-w-0 truncate font-mono text-[13px] leading-none text-foreground">
                      <span className="text-muted-foreground select-none">
                        “
                      </span>
                      {step.text}
                      <span className="text-muted-foreground select-none">
                        ”
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex h-9 min-w-0 flex-1 items-center rounded-[var(--radius-code)] border border-transparent ps-3 pe-3">
                    <p className="min-w-0 truncate text-[13px] leading-none text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-3"
          style={{
            animation: "sono-fade-up 520ms var(--motion-ease) 420ms both",
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
            href="/docs/components/accordion"
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
