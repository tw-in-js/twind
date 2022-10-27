import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import handleTwind from '@twind/with-sveltekit/hooks'

const handlers: Handle[] = [handleTwind()]

export const handle = handlers.length > 1 ? sequence(...handlers) : handlers[0]

export const handleError: HandleServerError = ({ error }) => {
  return {
    message: 'Whoops! ' + (error as Error).message,
    stack: (error as Error).stack,
    ...(error as any),
  }
}
