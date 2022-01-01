import type { Rule, Token, TokenGrouping, MaybeTokenInterpolation } from '../types'

import { join, tail, includes } from '../internal/util'

// The parsing is stacked based
// when ever we find a group start
// - in strings ':' or '(',
// - array values
// - object keys and their value
// we add an empty marker string `""` into `groupings` to mark the group start
// if we find a variant or prefix we push it onto `groupings`
// once the group ends (whitespace or ')') we drop all entries until the last marker
// This way we can filter `groupings` for truthy values which are either
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

const onlyPrefixes = (s: string): '' | boolean => s && !includes('!:', s[0])
const onlyVariants = (s: string): '' | boolean => s[0] == ':'

const addRule = (directive: Rule['d'], negate?: boolean): void => {
  rules.push({
    v: groupings.filter(onlyVariants),
    d: directive,
    n: negate,
    i: includes(groupings, '!'),
    $: '',
  })
}

const saveRule = (buffer: string): '' => {
  const negate = buffer[0] == '-'

  if (negate) {
    buffer = tail(buffer)
  }

  const prefix = join(groupings.filter(onlyPrefixes))

  addRule(buffer == '&' ? prefix : (prefix && prefix + '-') + buffer, negate)

  return ''
}

const parseString = (token: string, isVariant?: boolean): void => {
  let buffer = ''

  for (let char: string, dynamic = false, position = 0; (char = token[position++]); ) {
    if (dynamic || char == '[') {
      buffer += char
      dynamic = char != ']'
      continue
    }

    switch (char) {
      case ':':
        // Check if this is an pseudo element "after::"
        buffer =
          buffer && startGrouping(':' + (token[position] == char ? token[position++] : '') + buffer)

        break

      case '(':
        // If there is a buffer this is the prefix for all grouped tokens
        buffer = buffer && startGrouping(buffer)

        startGrouping()

        break

      case '!':
        startGrouping(char)

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
    } else if (buffer.slice(-1) == '-') {
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
      // string (inferred)
      parseString(token)
      break
    case 'function':
      // InlineDirective (inferred)
      addRule(token)
      break
    case 'object':
      if (Array.isArray(token)) {
        // Token[] (inferred)
        token.forEach(parseGroupedToken)
      } else if (token) {
        // TokenGrouping (coerced, see parseGroup() call below)
        Object.keys(token).forEach((key) => {
          parseGroup(key, (token as TokenGrouping)[key])
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
// Fast mode: tw`text(${'center'})`, tw`text-${'center'}`
// Slow mode: tw`text-${'red'}-600`, tw`bg(${'red'}(600 700(hover:&))`, tw`${"hover"}:text-blue-600`,
const staticsCaches = new WeakMap<TemplateStringsArray, Static[]>()

const buildStatics = (strings: TemplateStringsArray): Static[] => {
  let statics = staticsCaches.get(strings)

  if (!statics) {
    // Index within strings from which on we use slow mode for parsing
    // these means collecting all strings and string interpolations
    // into `buffer` and parse it dynamicly
    let slowModeIndex = NaN

    // Used during slow mode to join consecutive strings
    let buffer = ''

    statics = strings.map((token, index) => {
      if (
        slowModeIndex !== slowModeIndex &&
        (token.slice(-1) == '[' || includes(':-(', (strings[index + 1] || '')[0]))
      ) {
        // If the the string after the upcoming interpolation
        // would start a grouping we switch to slow mode now
        slowModeIndex = index
      }

      // Slow mode
      if (index >= slowModeIndex) {
        return (interpolation) => {
          // If first => reset bufferd tokens
          if (index == slowModeIndex) {
            buffer = ''
          }

          buffer += token

          // Join consecutive strings and numbers
          if (includes('rg', (typeof interpolation)[5])) {
            buffer += interpolation
          } else if (interpolation) {
            parseString(buffer)
            buffer = ''
            parseToken(interpolation)
          }

          // If last => parse remaining buffered tokens
          if (index == strings.length - 1) {
            parseString(buffer)
          }
        }
      }

      // Fast mode
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
        if (interpolation) {
          parseToken(interpolation)
        }
      }
    })

    staticsCaches.set(strings, statics)
  }

  return statics
}

export const parse = (tokens: string | MaybeTokenInterpolation): Rule[] => {
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
    // Token includes string type
    parseToken(tokens as Token)
  }

  return rules
}
