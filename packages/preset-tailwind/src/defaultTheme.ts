/**
 * @module @twind/preset-tailwind/defaultTheme
 */

import type { BaseTheme } from './baseTheme'

import * as colors from './colors'

import baseTheme from './baseTheme'

export type DefaultTheme = { colors: typeof colors } & BaseTheme

const theme: DefaultTheme = { ...baseTheme, colors }

export default theme
