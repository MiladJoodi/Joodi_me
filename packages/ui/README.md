# `@sonojs/ui`

SonoJS package + CLI (copy-source install).

```bash
npx @sonojs/ui@latest init
npx @sonojs/ui@latest add button
```

- `init` → theme tokens on `:root` (`styles/sonojs.css` + import in `globals.css`), utils, `components.json`
- `add <name>` → copies into `components/ui/`

```ts
import { Button } from "@/components/ui/button"
```

In this monorepo, the docs site also imports previews from `@sonojs/ui/components/*`.
