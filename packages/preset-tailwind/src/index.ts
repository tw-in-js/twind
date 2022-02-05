/**
 * [[include:packages/preset-tailwind/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type { Context, Preset } from 'twind'
import type { TailwindTheme } from './types'

import theme from './defaultTheme'
import preflight from './preflight'
import rules from './rules'
import variants from './variants'

export * from './types'

export interface TailwindPresetOptions {
  /** Allows to disable to tailwind preflight (default: `false` eg include the tailwind preflight ) */
  disablePreflight?: boolean | undefined
}

export default function presetTailwind({
  disablePreflight,
}: TailwindPresetOptions = {}): Preset<TailwindTheme> {
  return ({ stringify }) => ({
    // allow other preflight to run
    preflight: disablePreflight ? undefined : preflight,
    theme,
    variants,
    rules,
    // Hash/Tag tailwind custom properties during serialization
    stringify(property, value, context) {
      return stringify(hashVars(property, context), hashVars(value, context), context)
    },
  })
}

function hashVars(value: string, { h }: Context<TailwindTheme>): string {
  // PERF: check for --tw before running the regexp
  // if (value.includes('--tw')) {
  return value.replace(
    /--(tw-[\w-]+)\b/g,
    (_, property: string) => '--' + h(property).replace('#', ''),
  )
  // }

  // return value
}
