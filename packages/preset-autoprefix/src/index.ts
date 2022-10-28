import type { Preset } from 'twind'

import { cssPropertyAlias, cssPropertyPrefixFlags, cssValuePrefixFlags } from 'style-vendorizer'

const CSSPrefixFlags = [
  ['-webkit-', 1 << 0], // 0b001
  ['-moz-', 1 << 1], // 0b010
  ['-ms-', 1 << 2], // 0b100
] as const

export default function presetAutoprefix(): Preset {
  return ({ stringify }) => ({
    stringify(property, value, context) {
      let cssText = ''

      // Resolve aliases, e.g. `gap` -> `grid-gap`
      const propertyAlias = cssPropertyAlias(property)
      if (propertyAlias) cssText += stringify(propertyAlias, value, context) + ';'

      // Prefix properties, e.g. `backdrop-filter` -> `-webkit-backdrop-filter`
      const propertyFlags = cssPropertyPrefixFlags(property)
      const valueFlags = cssValuePrefixFlags(property, value)

      for (const prefix of CSSPrefixFlags) {
        if (propertyFlags & prefix[1]) {
          cssText += stringify(prefix[0] + property, value, context) + ';'
        }

        if (valueFlags & prefix[1]) {
          cssText += stringify(property, prefix[0] + value, context) + ';'
        }
      }

      /* Include the standardized declaration last */
      /* https://css-tricks.com/ordering-css3-properties/ */
      return cssText + stringify(property, value, context)
    },
  })
}
