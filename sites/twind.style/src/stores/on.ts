import type { Readable } from 'svelte/store'
import { readable } from 'svelte/store'

export interface EventSource<Value, Event> {
  addEventListener(event: Event, listener: (value: Value) => void): void
  removeEventListener(event: Event, listener: (value: Value) => void): void
}

export function on<StoreValue, Event = string>(
  source: StoreValue & EventSource<StoreValue, Event>,
  event: Event,
): Readable<StoreValue>

export function on<StoreValue, Event = string>(
  source: EventSource<StoreValue, Event>,
  event: Event,
  initialValue: StoreValue,
): Readable<StoreValue>

export function on(source: EventSource<any, any>, event: string, initialValue = source) {
  return readable(initialValue, (set) => {
    source.addEventListener(event, set)

    return () => source.removeEventListener(event, set)
  })
}
