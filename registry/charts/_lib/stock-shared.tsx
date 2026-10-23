"use client"

import { Rectangle, type BarShapeProps } from "recharts"

import { between, random } from "./chart-mock-data"

/**
 * Shared Stock gallery helpers — candle shapes, generators, indicators.
 * Semantic up/down via `--chart-up` / `--chart-down` (not navy×orange series).
 */

export type MarketCandle = {
  time: number
  open: number
  close: number
  low: number
  high: number
  volume: number
}

/** Soft bullish / bearish fills — theme tokens. */
export const CANDLE_UP = "var(--chart-up)"
export const CANDLE_DOWN = "var(--chart-down)"

/** Full high–low span for Recharts range `Bar`. */
export function candleRangeKey(entry: MarketCandle): [number, number] {
  return [entry.low, entry.high]
}

export function isBullish(entry: Pick<MarketCandle, "open" | "close">) {
  return entry.close >= entry.open
}

export function candleColor(entry: Pick<MarketCandle, "open" | "close">) {
  return isBullish(entry) ? CANDLE_UP : CANDLE_DOWN
}

function readOhlc(props: BarShapeProps): MarketCandle | null {
  const payload = props.payload as MarketCandle | undefined
  if (
    payload &&
    typeof payload.open === "number" &&
    typeof payload.close === "number" &&
    typeof payload.low === "number" &&
    typeof payload.high === "number"
  ) {
    return payload
  }
  return null
}

/** Wick + body candlestick (narrower body, fine wick). */
export function CandlestickShape(
  props: BarShapeProps & { dimmed?: boolean }
) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dimmed = false,
  } = props
  const candle = readOhlc(props)
  if (!candle) return null

  const { open, close, low, high } = candle
  const color = candleColor(candle)
  const opacity = dimmed ? 0.4 : 1

  if (high === low) {
    return (
      <Rectangle
        {...props}
        fill={color}
        stroke="none"
        fillOpacity={opacity}
      />
    )
  }

  const cx = Number(x) + Number(width) / 2
  const scale = Number(height) / (high - low)
  const yHigh = Number(y)
  const yLow = Number(y) + Number(height)
  const yOpen = yHigh + (high - open) * scale
  const yClose = yHigh + (high - close) * scale
  const bodyTop = Math.min(yOpen, yClose)
  const bodyH = Math.max(1.5, Math.abs(yClose - yOpen))
  const slot = Number(width)
  const bodyW = Math.max(4, slot * 0.88)
  const bodyX = cx - bodyW / 2

  return (
    <g opacity={opacity}>
      <line
        x1={cx}
        x2={cx}
        y1={yHigh}
        y2={yLow}
        stroke={color}
        strokeWidth={1.15}
        strokeLinecap="round"
      />
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyW}
        height={bodyH}
        fill={color}
        stroke="none"
      />
    </g>
  )
}

/**
 * Classic OHLC bar: vertical high–low stem, open tick left, close tick right.
 * Financial convention (open← / →close) — not mirrored for chart RTL.
 */
export function OhlcBar(props: BarShapeProps & { dimmed?: boolean }) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dimmed = false,
  } = props
  const candle = readOhlc(props)
  if (!candle) return null

  const { open, close, low, high } = candle
  const color = candleColor(candle)
  const opacity = dimmed ? 0.4 : 1

  if (high === low) {
    const cx = Number(x) + Number(width) / 2
    const midY = Number(y) + Number(height) / 2
    const tick = Math.max(4, Number(width) * 0.45)
    return (
      <g opacity={opacity} stroke={color} strokeWidth={1.5} fill="none">
        <line x1={cx - tick} x2={cx + tick} y1={midY} y2={midY} />
      </g>
    )
  }

  const cx = Number(x) + Number(width) / 2
  const scale = Number(height) / (high - low)
  const yHigh = Number(y)
  const yLow = Number(y) + Number(height)
  const yOpen = yHigh + (high - open) * scale
  const yClose = yHigh + (high - close) * scale
  const tick = Math.max(4, Number(width) * 0.45)

  return (
    <g opacity={opacity} stroke={color} strokeWidth={1.5} fill="none">
      <line x1={cx} x2={cx} y1={yHigh} y2={yLow} strokeLinecap="round" />
      <line x1={cx - tick} x2={cx} y1={yOpen} y2={yOpen} strokeLinecap="round" />
      <line
        x1={cx}
        x2={cx + tick}
        y1={yClose}
        y2={yClose}
        strokeLinecap="round"
      />
    </g>
  )
}

/** Intraday OHLC walk — same API as Recharts market mock helpers. */
export function generateMockMarketData(
  length: number,
  seed: number,
  startPrice = 100,
  startTime = Date.UTC(2026, 0, 12, 9, 30)
): MarketCandle[] {
  const gen = random(seed)
  const candles: MarketCandle[] = []
  const interval = 15 * 60 * 1000
  let lastClose = startPrice

  for (let i = 0; i < length; i++) {
    const time = startTime + i * interval
    const open = lastClose
    const move = between(gen, -200, 200) / 100
    const close = Math.max(0.01, +(open + move).toFixed(2))
    const baseHigh = Math.max(open, close)
    const baseLow = Math.min(open, close)
    const extraHigh = between(gen, 0, 100) / 100
    const extraLow = between(gen, 0, 100) / 100
    const high = +(baseHigh + extraHigh).toFixed(2)
    const low = Math.max(0.01, +(baseLow - extraLow).toFixed(2))
    const volume = between(gen, 800, 12_000)
    candles.push({ time, open, close, low, high, volume })
    lastClose = close
  }

  return candles
}

/** Daily series with percent noise — shared Stock demo base. */
export function generateNaturalCandles(
  length = 24,
  seed = 2141,
  startPrice = 242,
  startTime = Date.UTC(2025, 8, 1)
): MarketCandle[] {
  const gen = random(seed)
  const candles: MarketCandle[] = []
  const dayMs = 24 * 60 * 60 * 1000
  let lastClose = startPrice

  for (let i = 0; i < length; i++) {
    const time = startTime + i * dayMs
    const open = lastClose
    const drift = between(gen, -14, 16) / 10_000
    const shock =
      between(gen, 0, 100) > 88 ? between(gen, -35, 35) / 10_000 : 0
    const close = Math.max(10, Math.round(open * (1 + drift + shock) * 100) / 100)
    const bodyTop = Math.max(open, close)
    const bodyBottom = Math.min(open, close)
    const upperWick = bodyTop * (between(gen, 8, 70) / 10_000)
    const lowerWick = bodyBottom * (between(gen, 8, 70) / 10_000)
    const high = Math.round((bodyTop + upperWick) * 100) / 100
    const low = Math.max(1, Math.round((bodyBottom - lowerWick) * 100) / 100)
    const volume = between(gen, 12_000, 95_000)
    candles.push({ time, open, close, low, high, volume })
    lastClose = close
  }

  return candles
}

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < period) {
      out.push(null)
      continue
    }
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += values[j]!
    out.push(sum / period)
  }
  return out
}

/** Population stdev over a rolling window (paired with `sma`). */
export function stdev(values: number[], period: number): (number | null)[] {
  const means = sma(values, period)
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    const mean = means[i]
    if (mean == null) {
      out.push(null)
      continue
    }
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j]! - mean
      sum += d * d
    }
    out.push(Math.sqrt(sum / period))
  }
  return out
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  const k = 2 / (period + 1)
  let prev: number | null = null
  for (let i = 0; i < values.length; i++) {
    const v = values[i]!
    if (i + 1 < period) {
      out.push(null)
      continue
    }
    if (prev == null) {
      let sum = 0
      for (let j = i - period + 1; j <= i; j++) sum += values[j]!
      prev = sum / period
      out.push(prev)
      continue
    }
    prev = v * k + prev * (1 - k)
    out.push(prev)
  }
  return out
}

/** Classic Wilder RSI. */
export function rsi(closes: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(closes.length).fill(null)
  if (closes.length <= period) return out

  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i]! - closes[i - 1]!
    if (diff >= 0) avgGain += diff
    else avgLoss -= diff
  }
  avgGain /= period
  avgLoss /= period
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? -diff : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  }
  return out
}

export function macd(
  closes: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9
) {
  const fastEma = ema(closes, fast)
  const slowEma = ema(closes, slow)
  const macdLine: (number | null)[] = closes.map((_, i) => {
    if (fastEma[i] == null || slowEma[i] == null) return null
    return fastEma[i]! - slowEma[i]!
  })
  const macdValues = macdLine.map((v) => v ?? 0)
  const firstValid = macdLine.findIndex((v) => v != null)
  const signalRaw = ema(
    macdValues.slice(firstValid >= 0 ? firstValid : 0),
    signalPeriod
  )
  const signal: (number | null)[] = Array(closes.length).fill(null)
  const hist: (number | null)[] = Array(closes.length).fill(null)
  for (let i = 0; i < signalRaw.length; i++) {
    const idx = (firstValid >= 0 ? firstValid : 0) + i
    const s = signalRaw[i]
    signal[idx] = s
    if (macdLine[idx] != null && s != null) {
      hist[idx] = macdLine[idx]! - s
    }
  }
  return { macdLine, signal, hist }
}

export function toHeikinAshi(candles: MarketCandle[]): MarketCandle[] {
  const out: MarketCandle[] = []
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i]!
    const haClose = Math.round(((c.open + c.high + c.low + c.close) / 4) * 100) / 100
    const prev = out[i - 1]
    const haOpen = prev
      ? Math.round(((prev.open + prev.close) / 2) * 100) / 100
      : Math.round(((c.open + c.close) / 2) * 100) / 100
    const haHigh = Math.max(c.high, haOpen, haClose)
    const haLow = Math.min(c.low, haOpen, haClose)
    out.push({
      time: c.time,
      open: haOpen,
      close: haClose,
      high: haHigh,
      low: haLow,
      volume: c.volume,
    })
  }
  return out
}

export type RenkoBrick = {
  time: number
  open: number
  close: number
  low: number
  high: number
  volume: number
  up: boolean
}

/** Fixed-size Renko bricks from a close series (time axis is brick index). */
export function toRenko(
  candles: MarketCandle[],
  brickSize: number
): RenkoBrick[] {
  if (!candles.length || brickSize <= 0) return []
  const bricks: RenkoBrick[] = []
  const first = candles[0]!
  let brickOpen = Math.floor(first.close / brickSize) * brickSize

  for (const c of candles) {
    const price = c.close
    while (price >= brickOpen + brickSize) {
      const open = brickOpen
      const close = brickOpen + brickSize
      bricks.push({
        time: c.time + bricks.length,
        open,
        close,
        low: open,
        high: close,
        volume: c.volume,
        up: true,
      })
      brickOpen = close
    }
    while (price <= brickOpen - brickSize) {
      const open = brickOpen
      const close = brickOpen - brickSize
      bricks.push({
        time: c.time + bricks.length,
        open,
        close,
        low: close,
        high: open,
        volume: c.volume,
        up: false,
      })
      brickOpen = close
    }
  }
  return bricks
}

/** Solid Renko brick — gap between neighbors, rounded corners. */
export function RenkoBrickShape(
  props: BarShapeProps & { dimmed?: boolean }
) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    dimmed = false,
  } = props
  const payload = props.payload as RenkoBrick | undefined
  const up = payload?.up ?? false
  const color = up ? CANDLE_UP : CANDLE_DOWN
  const opacity = dimmed ? 0.4 : 1
  const gap = Math.max(1, Number(width) * 0.08)
  const w = Math.max(4, Number(width) - gap)
  const h = Math.max(2, Number(height) - 1)
  return (
    <Rectangle
      x={Number(x) + gap / 2}
      y={Number(y)}
      width={w}
      height={h}
      fill={color}
      fillOpacity={opacity}
      stroke="none"
      radius={2}
    />
  )
}

export function formatCandleDay(time: number, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(time))
}

/** Intraday axis / brush tick — UTC clock. */
export function formatCandleTime(time: number, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(time))
}

/** Category-axis label: short date + time (UTC). */
export function formatCandleCategoryLabel(time: number, locale = "en") {
  const d = new Date(time)
  const day = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d)
  const clock = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(d)
  return `${day} ${clock}`
}

export function formatCandlePrice(value: number, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCandleCompact(value: number, locale = "en") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

/** Running drawdown % from peak (≤ 0). */
export function runningDrawdown(closes: number[]) {
  let peak = closes[0] ?? 0
  return closes.map((c) => {
    peak = Math.max(peak, c)
    return peak === 0 ? 0 : ((c - peak) / peak) * 100
  })
}
