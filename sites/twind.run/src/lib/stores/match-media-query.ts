import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'
import { on } from './on'

export interface MediaQueryStoreValue {
  readonly matches: boolean
  readonly media: string
}

export function matchMediaQuery(query: string): Readable<MediaQueryStoreValue> {
  return typeof matchMedia == 'undefined'
    ? readable({ matches: false, media: query })
    : on<MediaQueryStoreValue>(matchMedia(query), 'change')
}
