# WinkUI registry

Consumers use the **`@winkui/ui`** CLI (copy-source install):

```bash
npx @winkui/ui@latest init          # design system + utils
npx @winkui/ui@latest add button    # one component → components/ui/button.tsx
```

All registry sources MUST support **RTL and LTR**.

## Parity (docs ↔ install)

What the docs preview shows must be what `add` installs. Keep `packages/ui` and `registry/` in sync (import paths may differ only), then always run `npm run registry:build` so `public/r/` is not stale. Rule: `.cursor/rules/winkui-registry-parity.mdc`.

## Add a component

1. `registry/ui/<name>/<name>.tsx` + mirror in `packages/ui` for docs
2. Examples + `registry/index.ts` (same latest API/look)
3. `scripts/registry-items.mjs` → `npm run registry:build`
4. Docs: Installation shows `init` + `add <name>`

### Published

| Item | CLI | Target |
|------|-----|--------|
| `accordion` | `npx @winkui/ui@latest add accordion` | `components/ui/accordion.tsx` |
| `alert` | `npx @winkui/ui@latest add alert` | `components/ui/alert.tsx` |
| `button` | `npx @winkui/ui@latest add button` | `components/ui/button.tsx` |

## Local smoke test (another project)

```bash
node I:/Github/new/FableUI/packages/cli/bin/winkui.mjs init --cwd /path/to/app --overwrite
node I:/Github/new/FableUI/packages/cli/bin/winkui.mjs add button --registry I:/Github/new/FableUI/public/r --cwd /path/to/app --overwrite
```
