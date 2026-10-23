import { readFile } from "node:fs/promises"
import path from "node:path"

/** Relative paths under `registry/charts/` for ported demos. */
const CHART_DEMO_SOURCES: Record<string, string> = {
  "simple-bar-chart": "simple-bar-chart.tsx",
}

export async function readChartDemoSource(
  id: string
): Promise<string | null> {
  const rel = CHART_DEMO_SOURCES[id]
  if (!rel) return null

  const filePath = path.join(process.cwd(), "registry/charts", rel)
  try {
    return await readFile(filePath, "utf8")
  } catch {
    return null
  }
}
