import type { Context, Preset } from '@twind/core'
import type { TailwindTheme } from './types'

import { preset } from '@twind/core'

import theme from './defaultTheme'
import preflight from './preflight'
import rules from './rules'
import variants from './variants'

export * from './types'

export interface TailwindPresetOptions {
  preflight?: boolean | undefined
  darkMode?: 'media' | 'class' | boolean | undefined
}

export default function presetTailwind({
  preflight: enablePreflight = true,
  darkMode = 'media',
}: TailwindPresetOptions = {}): Preset<TailwindTheme> {
  return preset(({ stringify }) => ({
    preflight: enablePreflight && preflight,
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
  }))
}

function hashVars(value: string, { h }: Context<TailwindTheme>): string {
  return value.replace(
    /--(tw-[\w-]+)\b/g,
    (_, property: string) => '--' + h(property).replace('#', '_'),
  )
}
