# Porting a chart from FarsiUI (per-file)

Say which id to bring (e.g. `chart-area-default` or gallery `simple-bar-chart`). Then:

## Locked visual pattern (canonical) — LOCKED

**Source of truth:** `registry/charts/bar/simple-bar-chart.tsx`  
**Do not restyle** without an explicit unlock. After any allowed edit: `npm run registry:build` so `public/r/simple-bar-chart.json` matches the site.

New / ported gallery charts should follow this chrome unless the chart type cannot (e.g. heatmap):

| Concern | Locked choice |
|---|---|
| Dual series | `--chart-1` navy `#1E3A8A` × `--chart-2` orange `#EA580C` (dark: `#3B82F6` / `#F97316`) |
| Tokens | `globals.css` + `vega-tokens.css` + registry `cssVars` — no hex in the demo file |
| Header | Title + subtitle; metric total + delta + active month (Intl); idle = last category |
| Bars | Grouped flat fills, top radius `8` (= control), width 36/28, category gap 18%/16%, barGap 8/6 |
| Scrub | Hover / touch / keyboard; inactive 40%; one neutral total above taller bar while scrubbing |
| Value labels | Never series-colored; never always-on (default). Exception: pyramid tip `%` — see below |
| Grid | Horizontal only, dashed `4 4`, quiet border opacity |
| Axes | No axis/tick lines; muted 12px tabular ticks; **no** rotated unit label |
| Legend | Bottom center, `size-2` **rounded-full** dots (outside SVG) |
| Tooltip | `ChartTooltip` + `ChartTooltipContent`; soft cursor wash |
| Motion | ease-out ~180–200ms; honor `prefers-reduced-motion`; no idle pulse |
| Direction | `useChartDir`; LTR data; RTL flips axis/layout only |
| a11y | `accessibilityLayer` + keyboard `aria-live` + `sr-only` table |
| Shared chrome | `chartBarContainerClassName` / `CHART_SERIES_*` from `_lib/chart-styles` |

Do **not** invent a second dual-series palette for “variety.” Semantic `--chart-3…5` only for status / alert accents.

## Per-chart deviations

Locked Simple Bar chrome is the **default starting point**. Chart-type or custom looks live in **that chart’s file** — do not fork the dual-series palette or restyle Simple/Stacked to match.

| Where | Use for |
|---|---|
| Same `registry/charts/<category>/<slug>.tsx` | Chart-local UI (e.g. pyramid always-on tip `%` via `EndLabel`, SVG ink via `color-mix` on `--chart-*`) |
| `registry/charts/_lib/` | Helpers shared by **2+** charts only |
| Sibling `.css` + registry `files` entry | Only when the chart needs real stylesheet rules (keyframes, complex selectors) — not for SVG label geometry |

**Population pyramid:** tip percentages outside each bar are always-on and series-tinted via `color-mix(…, var(--chart-*), var(--foreground))` — never mix with `black` (breaks dark mode). No hover tooltip overlay.

**Box plot:** custom `BoxShape` + `ErrorBar` whiskers + outlier `Scatter`; always-on median labels + median stroke use light ink (`#ffffff`) on the `--chart-1` box (never `foreground` — black-on-navy in light). Key legend (box / median / outlier); five-number tooltip. Metric header tracks median.

**On-fill labels:** any SVG text drawn on a series-colored fill must use light ink (`#ffffff`), same as `bar-chart-with-label-background`. Tip/scrub labels *outside* bars stay `var(--foreground)`. Never `color-mix(…, black)` for tip ink.

**Scrub flicker:** `isAnimationActive={!reducedMotion && !liveScrubbing}` — Cell opacity changes must not re-run bar enter animation. Prefer stable `LabelList` + `useCallback` content over inline `label={() => …}`. Dim inactive labels with opacity; do not unmount them.

**Always-on labels:** charts with permanent value ink (`bar-chart-with-label-background`, `bar-label`, `bar-label-custom`, `population-pyramid`, `box-plot`) use `isAnimationActive={false}` — enter animation grows height from 0 and makes labels blink on load.

**Waterfall:** floating `[bottom, top]` range bars from a running total; fills use semantic `--chart-up` / `--chart-down` + `--chart-1` for totals (not dual-series navy×orange for every step).

**Mix bar:** Store+Online stacked (`stackId`) beside a non-stacked Orders series; `--chart-3` for the third series; HTML legend hover/click focus-locks a series (dims others).

**Positive / negative bar:** grouped dual series that cross zero; `ReferenceLine` at y=0; Y ticks tinted by sign (`--chart-up` / `--destructive`); metric header shows signed net.

**Customized event bar:** click (and optional scrub) selects a month; chip row + detail panel stay in sync; average `ReferenceLine`; no tooltip (panel replaces it).

**Has background:** Desktop `Bar` uses Recharts `background={{ fill: "var(--muted)" }}` as a full-height track; Mobile stays a plain grouped bar.

**Ranged stacked:** Prep/Pack/Ship as `[start, end]` minute ranges inside `BarStack`; `--chart-3` for Ship; custom tooltip shows each stage window + total.

**Tiny bar:** sparkline-style stage (`h-[100px]`, `max-w-[300px]`, golden aspect) — no axes / tooltip / legend; locked metric header + scrub still apply.

**Animated bar width:** idle = all bars thin (`scaleX(20%)`); scrub expands only the active bar. `expanded = reducedMotion || (liveScrubbing && index === liveIndex)`.

**bar-interactive:** Store/Online toggle tabs show period totals; chart plots the active series only; dense daily X ticks (`minTickGap`); fullWidth preview.

**bar-active:** Per-category fills (`--chart-1…5`); featured index keeps a dashed stroke (`activeBarIndex`, default `2`); idle metric returns to the featured bar (not last).

**bar-horizontal:** `layout="vertical"` (category on Y, value on X); single series `--chart-1`; `XAxis.reversed` in RTL (bars grow left, Y on the right); tip radius stays `[0,8,8,0]` even in RTL (Recharts negative width — swapping to `[8,0,0,8]` rounds the base); tip label past the value tip; scrub uses Y.

**Horizontal RTL tip pattern:** tip at `x + width` always (width is negative when `XAxis.reversed`), `textAnchor` flip, tip gutter on the tip side. Same for `bar-label-custom`, `bar-mixed`, `timeline`. Always tip radius `[0,8,8,0]` — never swap corners in RTL.

**Custom tooltips:** plot islands are `dir="ltr"` — custom tooltip roots must set `dir={dir}` from `useChartDir` (box-plot, waterfall, ranged-stacked). `ChartTooltipContent` already does this via `useDirection`.

**Bar label (classic):** vertical single-series with always-on top value labels (neutral ink) — exception to the default “never always-on” rule.

**Bar label custom (classic):** horizontal (`layout="vertical"`) with always-on tip labels past the bar end; same scrub/Y-axis pattern as Bar Horizontal.

**area-chart:** dual overlapping monotone `Area`s (Desktop×Mobile) with **neon** chart-local styles (`useMarketNeon` → `--chart-up`/`--chart-down` + stroke bloom); navy×orange fallback; locked metric scrub chrome; stage uses `chartAreaContainerClassName`.

**stacked-area-chart:** three stacked monotone `Area`s (Desktop×Mobile×Tablet, `stackId`) with **neon** on Desktop/Mobile (`--chart-up`/`--chart-down`); `--chart-3` amber for Tablet; same locked scrub chrome + gradients.

**area-chart-range:** single `[low, high]` temperature band with **neon** (`--chart-up`); metric tracks high + span label; `ReferenceLine` at 0.

**area-chart-connect-nulls:** single **neon** area; stacked pair — gap at nulls vs `connectNulls`; April omitted; metric shows `—` on the null month.

**cardinal-area-chart:** side-by-side curve compare — `monotone` vs `natural` with **neon** up/down; shared scrub.

**percent-area-chart:** three stacked areas with `stackOffset="expand"` (100% share) + **neon** on Desktop/Mobile; metric tracks dominant series %; Y ticks as percent.

**synchronized-area-chart:** three `syncId` area panels — Desktop, Mobile + `Brush`, Total (`--chart-3`) with **neon** on Desktop/Mobile; shared metric scrubber; brush window offsets tooltip index.

**tiny-area-chart:** sparkline stage (no axes / tooltip / legend) with locked metric header scrubber + **neon** single series; `isAnimationActive={false}`.

**area-chart-fill-by-value:** single monotone area; fill splits at y=0 via `useYAxisScale` + `useChartHeight` gradient (**neon** up/down when branded); zero `ReferenceLine`; signed metric scrubber.

**area-chart-custom-animation:** single **neon** monotone area; custom entrance `animationDuration={900}` (0 when reduced-motion); metric scrubber pauses tween while scrubbing.

**range-area-chart-custom-animation:** **neon** `[low, high]` linear range area; custom entrance `animationDuration={1200}`; metric tracks high + span; scrub pauses tween.

**area-chart-with-custom-events:** **neon** `type="step"` area; chart-root handlers + `getRelativeCoordinate` with live event panel; mock seed `456` (20 weeks); scrub + context-menu `preventDefault`.

**prevent-right-click:** **neon** monotone area; `onContextMenu` → `preventDefault` with brief blocked flash; mock seed `4390435` (H1 y-series).

**area-interactive:** Store/Online toggle tabs show period totals; chart plots the active series only as a **neon** monotone area + gradient; dense daily X ticks (`minTickGap`); fullWidth preview — same interaction model as `line-interactive` / `bar-interactive`.

**area-step:** single **neon** `type="step"` area (Store H1 2026); flat segments between months; metric scrubber.

**area-gradient:** stacked Store×Online `type="natural"` areas with **neon** chart-local styles (`useMarketNeon` → `--chart-up`/`--chart-down` + stroke bloom); navy×orange fallback when raw; metric scrubber.

**market-cards:** three SVG area-sparkline cards (30-day up / KWD down / gold flat) with **neon** glow on branded skins; no Recharts; inherits page `dir`; fullWidth preview.

**chart-area-default (classic):** single Store series with `type="natural"` area + navy fill gradient; locked metric scrubber (same chrome as `line-default`).

**chart-area-linear (classic):** same Store series with `type="linear"` area + navy fill gradient; locked metric scrubber.

**chart-area-step (classic):** same Store series with `type="step"` area + navy fill gradient; locked metric scrubber. Distinct from gallery `area-step`.

**chart-area-legend (classic):** stacked Desktop×Mobile `type="natural"` areas + `ChartLegend` / `ChartLegendContent`; locked metric scrubber (total visitors).

**chart-area-stacked (classic):** same stacked Desktop×Mobile natural areas with footer series keys (no `ChartLegend`); locked metric scrubber. Distinct from gallery `stacked-area-chart`.

**chart-area-stacked-expand (classic):** same dual series with `stackOffset="expand"` (100% share); metric tracks leading share; distinct from gallery `percent-area-chart`.

**chart-area-icons (classic):** stacked Desktop×Mobile natural areas + `ChartLegend` with Lucide `TrendingDown` / `TrendingUp` series icons; locked metric scrubber.

**chart-area-gradient (classic):** stacked Store×Online natural areas with **neon** chart-local styles — `useMarketNeon` → `--chart-up`/`--chart-down`, fill fade `0.32→0` + drop-shadow stroke glow on branded skins; raw fallback uses navy×orange with classic `0.8→0.1` stops. Distinct from gallery `area-gradient`.

**chart-area-axes (classic):** stacked Store×Online solid fills (`fillOpacity` 0.4) + sparse Y-axis `tickCount={3}`; locked metric scrubber. Last classic area demo in the set.

**two-level-pie-chart:** nested pies (inner regions / outer channels); metric = idle outer total or scrub slice + “% of ring”; no on-slice labels; region legend only; `--chart-1…5`; RTL flips start/end angles.

**straight-angle-pie-chart:** half-pie `startAngle`/`endAngle` 180↔0, `cy="100%"` `outerRadius="120%"` `aspect-[2]`; no on-slice labels; metric = idle total or scrub slice + “% of total”; RTL swaps sweep so flat edge stays bottom.

**custom-active-shape-pie-chart:** donut with `activeShape` callout + outer ring; tooltip body suppressed; idle returns to `defaultActiveIndex` (0); value ink `foreground`, percent muted; center name uses slice fill.

**pie-chart-with-customized-label:** full pie with always-on mid-slice `%` labels (`labelLine={false}`); on-fill ink `#ffffff`; `isAnimationActive={false}` to avoid label blink; metric scrub dims siblings.

**pie-chart-with-padding-angle:** thin donut (`innerRadius` 80% / `outerRadius` 100%) with `paddingAngle={5}` + `cornerRadius="50%"`; no on-slice labels; `ChartLegend`; metric scrub dims siblings.

**pie-chart-in-grid:** CSS Grid teaching demo (`grid-cols-3` / `grid-rows-3`) — 2×2 + two 1×1 + 3×1 cells; shared donut `60%`/`80%`; English center labels; `isAnimationActive={false}`; no metric scrub; `fullWidth` preview.

**pie-with-gradient:** donut with custom radial + shine `shape`, `paddingAngle={3}` `cornerRadius={10}`; active expand + outer ring; center disc idle = total / scrub = name + `%`; channel cards drive active; no hardcoded `dir`; English / `Intl`.

**pie-donut-text:** compact donut (`innerRadius={60}` `strokeWidth={5}`); center `Label` always shows ring total + “Sales”; header metric scrub dims siblings; `--chart-1…5`; English / `Intl`; classic twin `chart-pie-donut-text` not ported yet.

**pie-interactive:** month `Select` drives active sector (expand + outer ring) + center value/month; `scrub` syncs pie hover → Select; needs registry `select`; no hardcoded `dir`; classic twin `chart-pie-interactive` not ported yet.

**simple-line-chart:** dual monotone `Line`s (Desktop×Mobile); same locked metric scrub chrome; dots dim to 40% when scrubbing inactive categories; stage uses `chartLineContainerClassName`.

**dashed-line-chart:** same chrome as simple-line; both series use `strokeDasharray` (`3 4 5 2` / `6 4`); idle `dot={false}` (activeDot only); legend shows dashed stroke samples.

**vertical-line-chart:** `layout="vertical"` (months on Y, values on X); dual `type="linear"` lines; portrait stage (`chartVerticalLineContainerClassName`); scrub via Y (Up/Down + `indexFromClientY`); `XAxis.reversed` + `YAxis` orientation/reversed for RTL — same pattern as bar-horizontal.

**line-chart-connect-nulls:** single navy series; stacked pair — gap at nulls vs `connectNulls`; April omitted in demo data; metric shows `—` on the null month; shared scrub across both plots.

**line-chart-with-reference-lines:** same chrome as simple-line; vertical `ReferenceLine` on March + horizontal at `y=200` (`--destructive`); label positions flip for RTL.

**customized-label-line-chart:** same chrome as simple-line; always-on alternating Desktop point labels (halo stroke); angled X ticks (`rotate(-35)`); scrub dims inactive labels.

**highlight-and-zoom-line-chart:** drag `ReferenceArea` to zoom X + dual Y domains (Cost×Impressions); Zoom out resets; no category scrub (drag is the interaction); `XAxis.reversed` + axis sides flip for RTL.

**line-chart-axis-interval:** stacked interval demos (`preserveStart` / `preserveEnd` / `preserveStartEnd` / `equidistantPreserveStart` / `1`); dense `interval={1}` uses angled X ticks; mock data via `chart-mock-data`.

**biaxial-line-chart:** dual Y-axes (`yAxisId` primary/secondary) with independent domains (revenue vs orders); axis ticks tinted to series; same locked scrub chrome as simple-line.

**line-chart-with-x-axis-padding:** same chrome as simple-line; `XAxis` `padding` inset (LTR `{ left: 30, right: 100 }`, RTL flipped) so end categories stay off the plot edge.

**customized-dot-line-chart:** same chrome as simple-line; Desktop `dot`/`activeDot` are smile/frown faces (`--chart-3` / `--chart-2`) by `HAPPY_THRESHOLD` (200 sessions); Mobile keeps round dots.

**synchronized-line-chart:** three `syncId` panels — Desktop line, Mobile line + `Brush`, Total area (`--chart-3`); shared metric scrubber; brush window offsets tooltip index.

**synchronized-different-data:** two `syncId` panels (daily × every-5-days) with custom `syncMethod` (`closestDate`, ±2 days); metric scrubber tracks the dense daily series.

**line-chart-custom-shape:** same chrome as simple-line; both series use custom Line `shape` (`OpacityFadeShape` via `Curve`) for entrance opacity fade (500ms; 0 when reduced-motion).

**line-chart-has-multi-series:** type-required multi `Line`s each with partial category `data` (overlapping windows); third series uses `--chart-3` (semantic amber); HTML legend; metric = sum of series present at active month.

**line-chart-negative-values-with-reference-lines:** numeric X/Y path through the origin; zero `ReferenceLine`s when `minX`/`minY` are negative; metric scrubber tracks Y at the active point.

**compare-two-lines:** type-required hover compare — portfolio (navy) vs reinvestment dashed (orange) + principal (muted); gradient scrub after cursor; delta `ReferenceLine` segment; custom compare tooltip.

**dynamic-z-index-line-chart:** Desktop×Mobile×Orders (`--chart-3` amber); HTML legend hover dims that series to 0.45 and raises `zIndex` (paint order last); metric = sum of three; scrub default on.

**tiny-line-chart:** sparkline stage (no axes / tooltip / legend) with locked metric header scrubber; navy single series; `isAnimationActive={false}`.

**animated-time-series:** dual Desktop×Mobile lines; circular sliding window (default 6 of 12); auto-advance ~800ms; pauses while scrubbing or `prefers-reduced-motion`.

**line-interactive:** Store/Online toggle tabs show period totals; chart plots the active series only as a monotone line (`dot={false}` idle); dense daily X ticks (`minTickGap`); fullWidth preview — same interaction model as `bar-interactive`.

**line-step:** same chrome as simple-line; both series use `type="step"` (flat segments between categories).

**line-default (classic):** single Store series with `type="natural"`; short id (no `chart-` prefix, same as `bar-default`); locked metric scrubber.

**line-dots-colors (classic):** natural sales line; each region dot uses `--chart-1…5` fills (same EN regions as bar-mixed); short id.

**line-label-custom (classic):** natural sales line; always-on region tip labels via `LabelList` (`isAnimationActive={false}`); short id.

**line-bar-area-composed-chart:** `ComposedChart` Area(orders)+Bar(online)+Line(store); chart-1…3; locked metric scrubber; EN months.

**same-data-composed-chart:** Bar + Line both on `sales`; trend stroke chart-2; locked metric scrubber.

**vertical-composed-chart:** `layout="vertical"` Bar(sales)+Line(target) by EN region; reserved tip gutter; locked scrubber.

**composed-chart-with-axis-labels:** dual Y (money + margin %); Area/Bar/Line; axis labels type-required; chart-1…3.

**scatter-and-line-of-best-fit:** Scatter(sales) + dashed OLS `fit` Line; continuous spend X; scrub nearest point.

**banded-chart:** Area `band` [low, high] + Line `actual`; scrub metric + in/above/below band.

**target-price-chart:** Area `range` + Line `price` + dashed `target`; scrub price vs target.

**Stock (category):** candle/OHLC bodies use semantic `--chart-up` / `--chart-down` when bullish/bearish — not navy×orange dual series for every bar. Preserve custom SVG shapes (`CandlestickShape`, `OhlcBar`, …) from `_lib` when ported. Overlays (SMA, bands) may use `--chart-1` / `--chart-2`.

**asset-returns:** horizontal `layout="vertical"` return % bars; lookback tabs + max/min stats; custom tip-rounded shape with on-fill USD labels; `XAxis.reversed` in RTL (negative width — never clamp to 0); navy / orange lowest highlight; metric scrubber.

**monthly-savings:** channel tabs (Gold/USD/fund/bank/cash) + compound balance; type-required rounded-top `VerticalBar`; year-end / profit stats; metric scrubber across months.

**candlestick:** `CandlestickShape` wick+body via `stock-shared`; `candleRangeKey` range Bar; `--chart-up`/`--chart-down`; metric scrubber on close.

**candlestick-dashboard:** type-required symbol card (ticker + session badge + last) + candles + volume strip tinted by candle direction; scrub syncs header/volume.

**candlestick-bar:** dual `syncId` panels — OHLC candles + signed change bars; type-required `Brush`; scrub maps through brush window.

**candlestick-category:** category X (`label` date+time); type-required dashed orange `ReferenceLine` news marker; scrub highlights when on news.

**candlestick-line:** `ComposedChart` candles + monotone SMA (`--chart-2`); `sma()` from stock-shared; scrub shows close vs SMA.

**sparklines:** type-required KPI area cards + watchlist (trend line / volume bars / share); no neon; scrub across cards and rows.

**stock-ohlc:** classic `OhlcBar` (H–L stem, open← / →close ticks) via stock-shared; intraday `generateMockMarketData`; `--chart-up`/`--chart-down`; metric scrubber.

**stock-line:** type-required symbol card + monotone close Area with soft gradient fill (`--chart-1`); no neon; metric scrubber.

**stock-column:** close columns with per-bar `Cell` via `candleColor`; intraday mock data; `--chart-up`/`--chart-down`; metric scrubber.

**stock-with-volume:** dual `syncId` panels — OHLC candles + volume bars tinted by candle direction; metric scrubber.

**stock-multi-series:** type-required summary cards + indexed % LineChart (AENE/FOLD/AUTO); chart-1…3; no neon; scrub updates cards + avg return.

**stock-trendline:** type-required symbol card + close Line + dashed SMA (`--chart-2`); `sma()` from stock-shared; no neon; metric scrubber (close vs SMA).

**tremor-area-charts:** install id kept; display title **KPI Area Charts** (no third-party brand). KPI minis + hero dual area + stacked/share; navy×orange×amber; no neon; scrub KPI/month.

**realtime-mountain-chart:** live sliding-window area; type-required play/pause + `PulsingLiveDot` (respects `prefers-reduced-motion`); no neon; metric scrubber.

**realtime-candlestick:** live forming candles + synced volume; sticky Y domain; play/pause; `CandlestickShape`; no neon/exchange branding; metric scrubber.

**heikin-ashi:** `toHeikinAshi` + `CandlestickShape`; type-required symbol card; tight category gap; metric scrubber.

**renko-chart:** `toRenko` + `RenkoBrickShape`; brick-index X (not calendar time); up/down brick counts in card; metric scrubber.

**volume-profile:** horizontal `layout="vertical"` volume-by-price; POC cell highlight (`--chart-up`); idle scrub on POC; `XAxis.reversed` in RTL (tip radius stays `[0,4,4,0]`); metric scrubber.

**order-book-depth:** dual `stepAfter` Areas (bid `--chart-up` / ask `--chart-down`); mid join; no neon; idle scrub on mid; metric scrubber.

**drawdown-chart:** dual `syncId` panels — equity `Line` (`--chart-1`) + underwater drawdown `Area` (`--chart-down`); `runningDrawdown` in stock-shared; summary cards; no neon; metric scrubber.

**bollinger-bands:** close `Line` (`--chart-1`) + dashed SMA mid (`--chart-3`) + ±σ envelope (`--chart-2` stacked Areas); `stdev` in stock-shared; phased series; no neon; metric scrubber.

**candlestick-indicators:** triple `syncId` panels — OHLC candles + RSI(14) + MACD(12,26,9) hist/lines; `ema`/`rsi`/`macd` in stock-shared; no neon; metric scrubber.

**multi-timeframe:** stacked Daily (`--chart-1`) / Weekly (`--chart-3`) / Monthly (`--chart-2`) close lines; weekly×5 / monthly×20 rollup from daily; per-panel scrub; no neon.

**heatmap-calendar:** SVG calendar grid (not Recharts); Sunday-start weeks; `--chart-1` intensity levels; holiday stroke; floating tip + keyboard scrub; EN/Gregorian; RTL flips week growth via `useChartDir`. Shared: `heatmap-shared`.

**heatmap-calendar-emerald:** same calendar grid; soft green `--chart-up` intensity; commits unit; no holiday strokes.

**heatmap-matrix:** day × hour (7×24) SVG grid; `--chart-1`; floating tip; EN weekdays; RTL flips columns via `useChartDir`.

**heatmap-matrix-values:** same matrix with `showValues` in-cell counts (when cell width allows); `--chart-up` green.

## Checklist

1. **Locate source**
   - Classic: `FarsiUI/apps/v4/registry/new-york-v4/charts/<id>.tsx`
   - Gallery: `FarsiUI/apps/v4/examples/chart/<category>/<slug>.tsx` (or synced `…/charts/gallery/<category>/`)
2. **Target path**
   - Authoring (classic + gallery) → `registry/charts/<category>/<slug>.tsx`
     (e.g. `bar/simple-bar-chart.tsx`, `area/chart-area.tsx`; optional `index.ts`)
   - Shared helpers → `registry/charts/_lib/`
   - Preview images → `public/charts/` (only with that demo)
   - **Consumer install (`target`):** `components/charts/<slug>.tsx` (flat);
     helpers → `components/charts/_lib/…` (never `components/ui/` for demos).
     Build rewrites `_lib` imports for the flat target.
   - Consumer imports: `@/components/ui/chart`, `@/lib/utils` — not `@sonojs/ui` or docs chrome
3. **Content**
   - Convert FA copy / digits / Jalali / toman labels to **English**
   - Match the **Locked visual pattern** above (start from `simple-bar-chart` chrome)
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
   - Confirm `public/r/<id>.json` matches the authored source
