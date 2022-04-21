/**
 * [[include:packages/preset-autoprefix/README.md]]
 *
 * @packageDocumentation
 * @module
 */

import type { Preset } from 'twind'

import { prefix } from 'stylis'

export default function presetAutoprefix(): Preset {
  return ({ stringify }) => ({
    stringify(property, value, context) {
      /* stylis requires the unprefixed declaration to be ended with ";" */
      const originalCssText = stringify(property, value, context) + ';'
      const prefixedCssText = prefix(originalCssText, property.length)

      /* stylis will make sure the standardized declaration is placed at last */
      return prefixedCssText.endsWith(';') ? prefixedCssText.slice(0, -1) : prefixedCssText
    },
  })
}
