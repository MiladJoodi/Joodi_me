# Chart shared libs

Shared helpers land here when a demo that needs them is ported (locale, ticks, neon, gallery `*-shared`).

Neon (market glow): `useMarketNeon` (always on for install + docs) + `chartNeonGlowProps` / `chartAreaGradientStops` / `MARKET_*` in `chart-styles.ts`. Tokens `--chart-up` / `--chart-down` / `--chart-mute` ship via `chart-styles` cssVars on `sonojs add`.

Do **not** copy FarsiUI FA locale modules until a demo requires them — and prefer English equivalents for SonoJS defaults.

Import path pattern (after a file lands):

```ts
import { … } from "@/registry/charts/_lib/…"
```
