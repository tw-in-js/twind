/**
 * Determines if two class name strings contain the same classes.
 *
 * @param a first class names
 * @param b second class names
 * @returns are they different
 */
export function changed(a: string, b: string): boolean {
  return a != b && '' + a.split(' ').sort() != '' + b.split(' ').sort()
}
