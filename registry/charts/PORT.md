# Porting a chart from FarsiUI (per-file)

Say which id to bring (e.g. `chart-area-default` or gallery `simple-bar-chart`). Then:

## Checklist

1. **Locate source**
   - Classic: `FarsiUI/apps/v4/registry/new-york-v4/charts/<id>.tsx`
   - Gallery: `FarsiUI/apps/v4/examples/chart/<category>/<slug>.tsx` (or synced `…/charts/gallery/<category>/`)
2. **Target path**
   - Classic → `registry/charts/<id>/<id>.tsx` + `index.ts`
   - Gallery → `registry/charts/<category>/<slug>.tsx` (authoring; gallery/ also OK)
   - Shared helpers → `registry/charts/_lib/`
   - Preview images → `public/charts/` (only with that demo)
   - **Consumer install (`target`):** `components/charts/<slug>.tsx`
     and helpers → `components/charts/_lib/…` (never `components/ui/` for demos)
   - Consumer imports: `@/components/ui/chart`, `@/lib/utils` — not `@sonojs/ui` or docs chrome
3. **Content**
   - Convert FA copy / digits / Jalali / toman labels to **English**
   - Keep custom styles (gradients, glow, `ChartStyle`, class constants, soft palettes) — no silent drops
   - Default geometry **LTR**; still work under `ChartPreview` RTL toggle (layout chrome only — **do not** swap data to Persian when `dir=rtl`)
4. **Deps**
   - Register in `scripts/registry-items.mjs` (`registry:chart` or shared lib)
   - Complete `registryDependencies` + npm `dependencies` (recharts, highcharts, …)
   - Prefer `ChartContainer` from installable `chart` when the source uses it
5. **Catalog**
   - Set entry `status: "ported"` in `lib/charts-catalog.ts`
   - Honor `fullWidth` on the view page / `ChartPreview`
6. **Build**
   - `npm run registry:build`
   - Spot-check `/charts/view/<id>` LTR and RTL
