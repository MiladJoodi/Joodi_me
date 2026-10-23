/**
 * Local stand-in for `@recharts/devtools` mock helpers.
 * RNG matches recharts/devtools LCG so demos match official seeds (e.g. 823).
 */

export type MockDataType = {
  label: string
  x: number
  y: number
  z: number
}

/**
 * LCG — not for security use.
 * @see https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
export function* random(seed: number): Generator<number, number, unknown> {
  const m = 2 ** 16 + 1
  const a = 75
  const c = 74
  let x = seed
  if (x > 0 && x < 1) {
    x = Math.round(x * 1000)
  }
  while (x < 0) {
    x += m
  }
  while (true) {
    x = (a * x + c) % m
    yield Math.round(x)
  }
}

export function between(
  rng: Generator<number, number, unknown>,
  min: number,
  max: number
): number {
  const val = rng.next().value
  return (val % (max - min)) + min
}

/** Same API as Recharts docs `generateMockData(length, seed)`. */
export function generateMockData(length: number, seed: number): MockDataType[] {
  const result: MockDataType[] = []
  const gen = random(seed)
  for (let i = 0; i < length; i++) {
    result.push({
      label: `Iter: ${i}`,
      x: between(gen, 100, 300),
      y: between(gen, 400, 800),
      z: between(gen, 1000, 2000),
    })
  }
  return result
}
