import type { IntellisenseClass, IntellisenseVariant } from './types'

const collator = new Intl.Collator('en', { numeric: true })

export function compareSuggestions(
  a: IntellisenseVariant | IntellisenseClass,
  b: IntellisenseVariant | IntellisenseClass,
): number {
  // sort variants before classes
  if (a.type === 'variant' && b.type === 'class') {
    return -1
  }

  if (a.type === 'class' && b.type === 'variant') {
    return 1
  }

  // group by first part
  const aInitial = a.value.replace(/^-/, '').split('-', 1)[0]
  const bInitial = b.value.replace(/^-/, '').split('-', 1)[0]
  const byInitial = collator.compare(aInitial, bInitial)
  if (byInitial) {
    return byInitial
  }

  // bump root class up
  if (a.value === aInitial) {
    return -1
  }

  if (b.value === bInitial) {
    return 1
  }

  // sort arbitrary values after other values
  if (/[-/]\[$/.test(a.value) && !/[-/]\[$/.test(b.value)) {
    return 1
  }

  if (!/[-/]\[$/.test(a.value) && /[-/]\[$/.test(b.value)) {
    return -1
  }

  // sort modifier values after other values
  if (/\/$/.test(a.value) && !/\/$/.test(b.value)) {
    return 1
  }

  if (!/\/$/.test(a.value) && /\/$/.test(b.value)) {
    return -1
  }

  if (a.type === 'class' && b.type === 'class') {
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

    // position within rule
    const byPosition = a.position - b.position
    if (byPosition) {
      return byPosition
    }
  }

  return collator.compare(a.value, b.value)
}
