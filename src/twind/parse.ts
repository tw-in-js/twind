import type { Rule, Token } from '../types'

import { join, tail, includes } from './util'

// The parsing is stacked based
// when ever we find a group start
// - in strings ':' or '(',
// - array values
// - object keys and their value
// we add an empty marker string `""` into `groupings` to mark the group start
// if we find a variant or prefix we push it onto `groupings`
// once the group ends (whitespace or ')') we drop all entries until the last marker
// This way we can filter `groupings` for trithy values which are either
// a variant (starting with ':') or a prefix

// Shared variables used during parsing

// List of active groupings: either variant (':xxx') or prefix
// sm:text => ':sm'
// sm:(text) => ':sm', ''
// text(center sm:hover:underline focus:black) sm:rounded
// => 'text'
// => 'text', ''
// => 'text', '', ':sm'
// => 'text', '', ':sm', ':hover'
// => 'text', ''
// => 'text', '', ':focus'
// => 'text'
// =>
// => ':sm'
let groupings: string[]

// List of parsed rules
let rules: Rule[]

// A new group has been found
// this maybe a value (':variant' or 'prefix') or an empty marker string
const startGrouping = (value = ''): '' => {
  groupings.push(value)
  return ''
}

// Close a group
// Within strings we need to distinguish between a whitespace and a closing bracket
// a) if we have a whitespace
// we want to keep everything up to including the last group start
//
// b) if we have a non-whitespace
// we want to keep everything before the last group start
const endGrouping = (isWhitespace?: boolean): void => {
  // true => +1
  // false => +0
  groupings.length = Math.max(groupings.lastIndexOf('') + ~~(isWhitespace as boolean), 0)
}

const onlyPrefixes = (s: string): '' | boolean => s && s[0] !== ':'
const onlyVariants = (s: string): '' | boolean => s[0] === ':'

const addRule = (directive: Rule['d'], negate?: boolean, important?: boolean): void => {
  rules.push({
    v: groupings.filter(onlyVariants),
    d: directive,
    n: negate,
    i: important,
    $: '',
  })
}

const saveRule = (buffer: string): '' => {
  const negate = buffer[0] === '-'

  if (negate) {
    buffer = tail(buffer)
  }

  const important = buffer[buffer.length - 1] === '!'

  if (important) {
    buffer = buffer.slice(0, -1)
  }

  const prefix = join(groupings.filter(onlyPrefixes))

  addRule(buffer === '&' ? prefix : (prefix && prefix + '-') + buffer, negate, important)

  return ''
}

const parseString = (token: string, isVariant?: boolean): void => {
  let char: string
  let buffer = ''

  for (let position = 0; position < token.length; ) {
    switch ((char = token[position++])) {
      case ':':
        buffer = buffer && startGrouping(':' + buffer)

        break

      case '(':
        // If there is a buffer this is the prefix for all grouped tokens
        buffer = buffer && startGrouping(buffer)

        startGrouping()

        break

      case ')':
      case ' ':
      case '\t':
      case '\n':
      case '\r':
        buffer = buffer && saveRule(buffer)
        endGrouping(char !== ')')

        break

      default:
        buffer += char
    }
  }

  if (buffer) {
    if (isVariant) {
      startGrouping(':' + buffer)
    } else if (buffer.slice(-1) === '-') {
      startGrouping(buffer.slice(0, -1))
    } else {
      saveRule(buffer)
    }
  }
}

const parseGroupedToken = (token: Token): void => {
  startGrouping()

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  parseToken(token)

  endGrouping()
}

const parseGroup = (key: string, token: Token): void => {
  if (token) {
    startGrouping()

    // we care about: string, object and function
    // "undefined"
    // "object" - this includes arrays
    // "boolean"
    // "number"
    // "bigint"
    // "string"
    // "symbol"
    // "function"
    // 2nd char is uniq
    const isVariant = includes('tbu', (typeof token)[1])

    parseString(key, isVariant)

    if (isVariant) {
      parseGroupedToken(token)
    }

    endGrouping()
  }
}

const parseToken = (token: Token): void => {
  switch (typeof token) {
    case 'string':
      parseString(token)
      break
    case 'function':
      addRule(token)
      break
    case 'object':
      if (Array.isArray(token)) {
        token.forEach(parseGroupedToken)
      } else if (token) {
        Object.keys(token).forEach((key) => {
          parseGroup(key, token[key])
        })
      }
  }
}

// A function to be called with an interpolation
// to add dynamic rules
type Static = (interpolation: Token) => void

// Template literal strings do not change
// we can pre-calculate all groupings and static rules
// which are later combined with the dynamic rules from interpolations
//
// For this to work we assume that interpolations do not
// affect the current groupings:
// Valid: tw`text(${'center'})`
// Invalid: tw`text-${'center'}`
const staticsCaches = new WeakMap<TemplateStringsArray, Static[]>()

const buildStatics = (strings: TemplateStringsArray): Static[] => {
  let statics = staticsCaches.get(strings)

  if (!statics) {
    // For each static string
    statics = strings.map((token) => {
      // Reset rules to extract all static generated rules
      const staticRules = (rules = [])

      parseString(token)

      // Copy the active groupings to set them
      // before interpolation processing
      const activeGroupings = [...groupings]

      // Reset the rules
      rules = []

      return (interpolation) => {
        rules.push(...staticRules)
        groupings = [...activeGroupings]
        interpolation && parseToken(interpolation)
      }
    })

    staticsCaches.set(strings, statics)
  }

  return statics
}

export const parse = (tokens: unknown[]): Rule[] => {
  groupings = []
  rules = []

  // Handles template literal strings
  if (
    Array.isArray(tokens[0] as TemplateStringsArray) &&
    Array.isArray((tokens[0] as TemplateStringsArray).raw)
  ) {
    buildStatics(tokens[0] as TemplateStringsArray).forEach((apply, index) =>
      apply(tokens[index + 1] as Token),
    )
  } else {
    parseToken(tokens as Token)
  }

  return rules
}
