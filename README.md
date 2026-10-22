# WinkUI

Accessible React + Tailwind component library with calm defaults, first-class RTL/LTR, and a tiny docs/registry shell.

## Design system

| Layer | Choice |
|-------|--------|
| Surfaces / text | Zinc neutrals |
| Primary | `#2563EB` (light) / `#396EF0` (dark, AA vs white) |
| Primary label | `#FFFFFF` on primary (light **and** dark) |
| Hover / Active | `#1D4ED8` / `#1E40AF` |
| Direction | Inherit `dir`; logical CSS; `DirectionProvider` / `useDirection` |
| Font | Geist + Geist Mono |
| Radius | NY: base `0.625rem` · tooltip ~6 · control ~8 · surface 10 |
| Sizes | Nova: Button default h-8 (32) · sm h-7 · lg h-9 · Input h-8 · radius 0.625rem · Sidebar ~240 · Content max ~1280 |
| Spacing | 4px scale (see `AGENTS.md` Design System Standards) |

RTL/LTR: set `dir` on `<html>`, see `/docs/direction`. Rules: `.cursor/rules/winkui-direction.mdc`, `registry/README.md`.

## Develop

```bash
npm install
npm run dev
```

Consumers use the **`@winkui/ui`** CLI (copy-source install):

```bash
npx @winkui/ui@latest init          # design system + lib/utils + components.json
npx @winkui/ui@latest add button    # → components/ui/button.tsx
```

```ts
import { Button } from "@/components/ui/button"
```

Registry payloads: `npm run registry:build` → `public/r/`.

## Caching and content freshness

Host-agnostic policy (no Redis, no CDN-specific purge APIs):

| Path | Behavior |
|------|----------|
| Docs (`/docs/*`) | Static at `next build` (`dynamic = "force-static"`). `Cache-Control: public, max-age=0, must-revalidate` so CDNs/browsers revalidate after deploy (avoids year-long `s-maxage` on HTML). |
| `public/r/*.json` | Stable URLs; `Cache-Control: public, max-age=0, must-revalidate` via `next.config.ts`. Never `immutable`. |
| `/_next/static/*` | Next.js defaults (content-hashed, long-lived). Do not override. |

Registry index and item JSON share `version` + `generatedAt` from one atomic `registry:build`. The CLI refuses `winkui add` when those diverge.

### Verify after deploy / locally

```bash
npm run build
npm run start
# other terminal:
npm run verify:cache
npm run winkui -- init --cwd /tmp/winkui-smoke --overwrite
npm run winkui -- add button --registry ./public/r --cwd /tmp/winkui-smoke --overwrite
```

Manual checks:

1. `curl -I http://127.0.0.1:3000/r/registry.json` — expect `max-age=0, must-revalidate`.
2. `curl -I http://127.0.0.1:3000/r/button.json` — same policy.
3. `curl -I` a `/_next/static/...` asset from the page HTML — must **not** use the `/r` policy.
4. Change a component → `npm run build` → restart → hard refresh docs and re-fetch `/r/button.json` — new content.
5. Client-side navigation may briefly show a pre-deploy RSC payload until a full refresh; hard refresh after deploy is enough.

## Add a component

1. `registry/ui/<name>/…` + mirror in `packages/ui` for docs previews
2. Examples under `registry/examples/<name>/` + `registry/index.ts`
3. `scripts/registry-items.mjs` + `npm run registry:build`
4. `lib/docs-nav.ts` + docs: `npx @winkui/ui@latest init` then `add <name>`

See `registry/README.md`.
