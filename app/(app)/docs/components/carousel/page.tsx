import {
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  DocsInstallation,
} from "@/components/docs"
import { withVariantCode } from "@/lib/docs-variant-examples"

const exampleDefs = [
  {
    name: "carousel-default",
    title: "Default",
    description: "A basic carousel with previous and next controls.",
    requires: ["card"],
  },
  {
    name: "carousel-size",
    title: "Sizes",
    description:
      "Set slide width with `basis` utilities on `CarouselItem` (e.g. `md:basis-1/2`).",
    requires: ["card"],
  },
  {
    name: "carousel-spacing",
    title: "Spacing",
    description:
      "Override gap with matching `-ms-*` on `CarouselContent` and `ps-*` on each item.",
    requires: ["card"],
  },
  {
    name: "carousel-orientation",
    title: "Orientation",
    description:
      'Use `orientation="vertical"` and give `CarouselContent` a fixed height.',
    requires: ["card"],
  },
  {
    name: "carousel-api",
    title: "API",
    description:
      "Pass `setApi` to read Embla state such as the current slide index.",
    requires: ["card"],
  },
]

const usageSource = `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function Example() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>One</CarouselItem>
        <CarouselItem>Two</CarouselItem>
        <CarouselItem>Three</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}`

export default async function CarouselDocsPage() {
  const examples = await withVariantCode(exampleDefs)

  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-h1">Carousel</h1>
        <p className="leading-relaxed text-muted-foreground">
          A carousel with motion and swipe, built with Embla. Supports sizes,
          spacing, orientation, and the Embla API.
        </p>
      </header>

      <section className="space-y-4">
        <ComponentVariantPreview examples={examples} />
      </section>

      <DocsInstallation name="carousel" />

      <section className="space-y-3">
        <h2 className="text-h3">Usage</h2>
        <ComponentSource title="carousel.tsx" lang="tsx" code={usageSource} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3">Props</h2>
        <DocsApiProps
          rows={[
            {
              name: "opts",
              type: "CarouselOptions",
              defaultValue: "—",
              description: "Embla options such as align, loop, and direction.",
            },
            {
              name: "orientation",
              type: '"horizontal" | "vertical"',
              defaultValue: '"horizontal"',
              description: "Scroll axis of the carousel.",
            },
            {
              name: "plugins",
              type: "CarouselPlugin",
              defaultValue: "—",
              description: "Embla plugins (for example Autoplay).",
            },
            {
              name: "setApi",
              type: "(api: CarouselApi) => void",
              defaultValue: "—",
              description: "Receives the Embla API once the carousel is ready.",
            },
          ]}
        />
      </section>
    </article>
  )
}
