function range(start: number, stop: number, step?: number): number[] {
  const increment = step ?? 1
  return Array(
    Math.ceil((stop - start) / increment)
  ).fill(start)
   .map((x, y) => x + y * increment)
}

export { range }
