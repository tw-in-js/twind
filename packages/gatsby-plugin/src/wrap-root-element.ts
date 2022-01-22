import type { ReactElement } from 'react'
import type { WrapPageElementBrowserArgs, WrapRootElementNodeArgs, PluginOptions } from 'gatsby'
import type { TwindConfig } from 'twind'

import { setup } from 'twind'

export function wrapRootElement(
  { element }: WrapPageElementBrowserArgs | WrapRootElementNodeArgs,
  { config }: PluginOptions,
): ReactElement {
  setup(config as TwindConfig)
  return element
}
