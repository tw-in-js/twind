import { startHref } from './docs/index.json'

export function get() {
  return {
    body: {
      docStartHref: startHref,
    },
  }
}

export interface Body {
  docStartHref: string | undefined
}
