# `@winkui/ui`

WinkUI package + CLI (copy-source install).

```bash
npx @winkui/ui@latest init
npx @winkui/ui@latest add button
```

- `init` → scoped design system (`.winkui` tokens, host theme untouched), utils, `components.json`, auto-import in `globals.css`
- `add <name>` → copies into `components/ui/` (components include class `winkui`)

```ts
import { Button } from "@/components/ui/button"
```

In this monorepo, the docs site also imports previews from `@winkui/ui/components/*`.
