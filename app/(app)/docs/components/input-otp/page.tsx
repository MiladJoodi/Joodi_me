import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "input-otp-default",
    title: "Basic",
    description:
      "Six slots with `InputOTPSeparator` between groups. Supports paste.",
    npmRequires: ["lucide-react", "input-otp"],
  },
  {
    name: "input-otp-pattern",
    title: "Pattern",
    description:
      "Restrict input with `pattern={REGEXP_ONLY_DIGITS}` from `input-otp`.",
    npmRequires: ["input-otp"],
  },
  {
    name: "input-otp-disabled",
    title: "Disabled",
    description:
      "Pass `disabled` on `InputOTP`. Pair with `data-disabled` on `Field`.",
    requires: ["field", "label", "separator"],
    npmRequires: ["lucide-react", "input-otp"],
  },
  {
    name: "input-otp-controlled",
    title: "Controlled",
    description: "Drive the value with `value` and `onChange`.",
    requires: ["field", "label", "separator"],
    npmRequires: ["input-otp"],
  },
  {
    name: "input-otp-invalid",
    title: "Invalid",
    description:
      "Set `aria-invalid` on the root and slots; use `FieldError` for the message.",
    requires: ["field", "label", "separator"],
    npmRequires: ["input-otp"],
  },
  {
    name: "input-otp-four",
    title: "Four Digits",
    description:
      "A PIN-style control with `maxLength={4}` and digits-only pattern.",
    npmRequires: ["input-otp"],
  },
]

const usageSource = `import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function Example() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}`

const compositionSource = `InputOTP
├── InputOTPGroup
│   ├── InputOTPSlot
│   └── …
├── InputOTPSeparator
└── InputOTPGroup
    └── …`

export default async function InputOTPDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Input OTP</h1>
        <p className="leading-relaxed text-muted-foreground">
          Accessible one-time password input with copy-paste. Slots are{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            size-8
          </code>{" "}
          to match the control scale. Built on the{" "}
          <code className="rounded-md border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.9em]">
            input-otp
          </code>{" "}
          package.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="input-otp" />

      <section className="space-y-3">
        <h2 className="text-h3">Composition</h2>
        <ComponentSource
          title="structure"
          lang="tsx"
          code={compositionSource}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="input-otp.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "maxLength",
              type: "number",
              defaultValue: "—",
              description: "Required. Number of characters / slots.",
            },
            {
              name: "pattern",
              type: "string",
              defaultValue: "—",
              description:
                "Regexp string — e.g. `REGEXP_ONLY_DIGITS` from `input-otp`.",
            },
            {
              name: "value / onChange",
              type: "string / (value) => void",
              defaultValue: "—",
              description: "Controlled value API.",
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: "false",
              description: "Disables the underlying input.",
            },
            {
              name: "index",
              type: "number",
              defaultValue: "—",
              description: "Required on `InputOTPSlot` — zero-based slot index.",
            },
            {
              name: "containerClassName",
              type: "string",
              defaultValue: "—",
              description: "Classes for the OTP container flex row.",
            },
          ]}
        />
      </section>
    </article>
  )
}
