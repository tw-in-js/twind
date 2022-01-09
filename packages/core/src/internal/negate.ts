export function negate(value: string | number): string {
  return `calc(${value} * -1)`
}
