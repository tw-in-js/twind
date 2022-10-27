import { writable, type Writable } from 'svelte/store'

export function localStore<T>(key: string): Writable<T | undefined>
export function localStore<T>(key: string, defaultValue: T): Writable<T>

export function localStore(key: string, defaultValue?: any): Writable<any> {
  return store(typeof localStorage == 'undefined' ? undefined : localStorage, key, defaultValue)
}

export function sessionStore<T>(key: string): Writable<T | undefined>
export function sessionStore<T>(key: string, defaultValue: T): Writable<T>

export function sessionStore(key: string, defaultValue?: any): Writable<any> {
  return store(typeof sessionStorage == 'undefined' ? undefined : sessionStorage, key, defaultValue)
}

function store(storageArea: Storage | undefined, key: string, defaultValue?: any): Writable<any> {
  if (!storageArea) {
    return writable(defaultValue)
  }

  const { set, update, subscribe } = writable(parse(storageArea.getItem(key), defaultValue))

  if (typeof addEventListener == 'function') {
    addEventListener('storage', (event) => {
      if (event.key === key && event.storageArea === storageArea) {
        set(parse(event.newValue, defaultValue))
      }
    })
  }

  return {
    set(value) {
      set(value)
      storageArea.setItem(key, JSON.stringify(value))
    },
    update(updater) {
      update((value) => {
        value = updater(value)
        storageArea.setItem(key, JSON.stringify(value))
        return value
      })
    },
    subscribe,
  }
}

function parse<T>(value: any, defaultValue?: T): T | undefined {
  try {
    return (value == null ? null : JSON.parse(value)) ?? defaultValue
  } catch {
    return defaultValue
  }
}
