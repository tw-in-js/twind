import type { Readable } from 'svelte/store'
import { derived } from 'svelte/store'
import { matchMediaQuery } from './match-media-query'

export function matchesMediaQuery(query: string): Readable<boolean> {
  return derived(matchMediaQuery(query), (match) => match.matches)
}
