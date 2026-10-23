# Chart shared libs

Shared helpers land here when a demo that needs them is ported (locale, ticks, neon, gallery `*-shared`).

Do **not** copy FarsiUI FA locale modules until a demo requires them — and prefer English equivalents for SonoJS defaults.

Import path pattern (after a file lands):

```ts
import { … } from "@/registry/charts/_lib/…"
```
