/**
 * [[include:packages/cdn/README.md]]
 *
 * @packageDocumentation
 * @module
 */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Fix exported global variable from `twindCdn` to `twind`
/* @distilt-global-name twind */

import type {
  Twind,
  BaseTheme,
  TwindConfig,
  TwindUserConfig,
  Preset,
  ExtractThemes,
  Sheet,
} from 'twind'

import type { TailwindPresetOptions, TailwindTheme } from '@twind/tailwind'

import { twind, observe, auto, cssom } from 'twind'
import { defineConfig } from '@twind/tailwind'

// If we run in the browser as `<script src="..."></script>` auto call setup once the body starts rendering
const cancelAutoSetup = /* @__PURE__ */ auto(setup)

export function setup<Theme extends BaseTheme = TailwindTheme, SheetTarget = unknown>(
  config?: TwindConfig<Theme> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<Theme & TailwindTheme, SheetTarget>

export function setup<
  Theme = TailwindTheme,
  Presets extends Preset<any>[] = Preset[],
  SheetTarget = unknown,
>(
  config?: TwindUserConfig<Theme, Presets> & TailwindPresetOptions,
  sheet?: Sheet<SheetTarget>,
  target?: HTMLElement,
): Twind<TailwindTheme & ExtractThemes<Theme, Presets>, SheetTarget>

export function setup(
  config: (TwindConfig | TwindUserConfig) & TailwindPresetOptions = {},
  sheet: Sheet = cssom(),
  target?: HTMLElement,
): Twind {
  cancelAutoSetup()

  return observe(twind(defineConfig(config as TwindConfig), sheet), target)
}
