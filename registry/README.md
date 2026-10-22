# SonoJS registry

```bash
npx @sonojs/ui@latest init
npx @sonojs/ui@latest add button
```

## Single source (UI)

Edit **`packages/ui/src/components/<name>.tsx`** only.  
`npm run registry:build` inlines it into `public/r/` (imports → `@/…` for consumers).

Blocks/charts still live under `registry/blocks/`, `registry/charts/`.

## Add a UI component

1. `packages/ui/src/components/<name>.tsx`
2. Examples + `registry/index.ts`
3. Entry in `scripts/registry-items.mjs`
4. `npm run registry:build`
5. Docs page under `app/(app)/docs/components/<name>/`

## Local smoke test

```bash
# Docs / registry server running on :3000, or use the folder:
npx @sonojs/ui@latest add button --registry I:/Github/new/FableUI/public/r --cwd /path/to/app --overwrite
```
