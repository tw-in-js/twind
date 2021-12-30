import { parse } from './parse'
import { stringifyRule } from './helpers'

export const expandGroups = (classNames: string): string =>
  parse(classNames)
    .map((rule) => stringifyRule(rule))
    .join(' ')
