import type { Context, Preset } from 'twind'
import type { TailwindTheme } from './types'

import theme from './defaultTheme'
import preflight from './preflight'
import rules from './rules'
import variants from './variants'

export * from './types'

export interface TailwindPresetOptions {
  darkMode?: 'media' | 'class' | boolean | undefined
  enablePreflight?: boolean | undefined
}

export default function presetTailwind({
  darkMode = 'media',
  enablePreflight = true,
}: TailwindPresetOptions = {}): Preset<TailwindTheme> {
  return ({ stringify }) => ({
    // allow other preflight to run
    preflight: enablePreflight ? preflight : undefined,
    theme,
    variants: [
      ['dark', darkMode == 'class' ? '.dark &' : '@media (prefers-color-scheme:dark)'],
      ...variants,
    ],
    rules,
    // Hash/Tag tailwind custom properties during serialization
    stringify(property, value, context) {
      return stringify(hashVars(property, context), hashVars(value, context), context)
    },
  })
}

function hashVars(value: string, { h }: Context<TailwindTheme>): string {
  return value.replace(
    /--(tw-[\w-]+)\b/g,
    (_, property: string) => '--' + h(property).replace('#', ''),
  )
}
