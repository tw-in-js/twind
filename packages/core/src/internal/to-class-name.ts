import type { SingleParsedRule } from '../types'

export function toClassName({ name, important, variants }: SingleParsedRule): string {
  return [...variants, (important ? '!' : '') + name].join(':')
}
