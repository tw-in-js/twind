export function interleave<Interpolations>(
  strings: TemplateStringsArray,
  interpolations: readonly Interpolations[],
  handle: (interpolation: Interpolations) => string,
): string {
  return interpolations.reduce(
    (result: string, interpolation, index) => result + handle(interpolation) + strings[index + 1],
    strings[0],
  )
}
