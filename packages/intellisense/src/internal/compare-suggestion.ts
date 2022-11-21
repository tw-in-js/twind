import type { IntellisenseClass, IntellisenseVariant } from './types'
import { atRulePrecedence, seperatorPrecedence } from '../../../core/src/internal/precedence'

const collator = new Intl.Collator('en', { numeric: true })

export function compareSuggestions(
  a: IntellisenseVariant | IntellisenseClass,
  b: IntellisenseVariant | IntellisenseClass,
  prefix?: string | undefined,
): number {
  // sort variants and classes
  const variantsFirst = !prefix
  if (a.type === 'variant' && b.type === 'class') {
    return variantsFirst ? -1 : 1
  }

  if (a.type === 'class' && b.type === 'variant') {
    return variantsFirst ? 1 : -1
  }

  // Move special chars after "normal"
  if (!/^[-a-z\d]/i.test(a.value) && /^[-a-z\d]/i.test(b.value)) {
    return 1
  }

  if (/^[-a-z\d]/i.test(a.value) && !/^[-a-z\d]/i.test(b.value)) {
    return -1
  }

  const isVariant = a.type === 'variant'
  // by min width
  if (isVariant) {
    const aMinWidth = a.description?.startsWith('@') && a.description.includes('min-width')
    const bMinWidth = b.description?.startsWith('@') && b.description.includes('min-width')

    if (aMinWidth && !bMinWidth) {
      return -1
    }

    if (!aMinWidth && bMinWidth) {
      return 1
    }

    if (aMinWidth && bMinWidth) {
      const byAtRulePrecedence =
        atRulePrecedence(a.description as string) - atRulePrecedence(b.description as string)

      if (byAtRulePrecedence) {
        return byAtRulePrecedence
      }
    }
  }

  // group by first part
  if (!prefix) {
    const aInitial = a.value.replace(/^-/, '').split('-', 1)[0]
    const bInitial = b.value.replace(/^-/, '').split('-', 1)[0]

    const byInitial = collator.compare(byName(aInitial), byName(bInitial))
    if (byInitial) {
      return byInitial
    }

    // bump root class up
    if (a.value === aInitial && b.value !== bInitial) {
      return -1
    }

    if (b.value === bInitial && a.value !== aInitial) {
      return 1
    }

    const bySeperator = seperatorPrecedence(a.value) - seperatorPrecedence(b.value)
    if (bySeperator) {
      return bySeperator
    }
  }

  // sort arbitrary values after other values
  const arbitrarySuffix = isVariant ? '[:' : '['
  if (a.value.endsWith(arbitrarySuffix) && !b.value.endsWith(arbitrarySuffix)) {
    return 1
  }

  if (!a.value.endsWith(arbitrarySuffix) && b.value.endsWith(arbitrarySuffix)) {
    return -1
  }

  // sort modifier values after other values
  const modifierSuffix = isVariant ? '/:' : '/'
  if (a.value.endsWith(modifierSuffix) && !b.value.endsWith(modifierSuffix)) {
    return 1
  }

  if (!a.value.endsWith(modifierSuffix) && b.value.endsWith(modifierSuffix)) {
    return -1
  }

  if (!isVariant) {
    // opacity last
    if (a.value.includes('-opacity') && !b.value.includes('-opacity')) {
      return 1
    }

    if (!a.value.includes('-opacity') && b.value.includes('-opacity')) {
      return -1
    }

    // color next to last
    if (a.color && !b.color) {
      return 1
    }

    if (!a.color && b.color) {
      return -1
    }
  }

  // keep same rules together
  const byIndex = b.index - a.index
  if (byIndex) {
    return byIndex
  }

  // group by source
  if (a.source === b.source) {
    // sort negative classes after regular one
    if (a.value.startsWith('-') && !b.value.startsWith('-')) {
      return 1
    }

    if (!a.value.startsWith('-') && b.value.startsWith('-')) {
      return -1
    }
  }

  return collator.compare(byName(a.value), byName(b.value))
}

function byName(s: string | null | undefined) {
  return (s || '').replace(/\W/g, (c) => String.fromCharCode(127 + c.charCodeAt(0))) + '\x00'
}
