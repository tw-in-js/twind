import type { ParsedDevRule } from '../../../twind/src/internal/parse'
import type { ColorInformation, Diagnostics, DocumentationAt } from '../types'
import type { IntellisenseContext, Boundary } from '../internal/types'

import * as csstree from 'css-tree'

import { parse } from '../../../twind/src/internal/parse'
import { fixClassList, parseHTML } from '../../../twind/src/internal/parse-html'
import { toClassName } from '../../../twind/src/internal/to-class-name'

import { editabelColorRe, parseColor } from '../internal/color'
import { adjustRuleLocation } from '../internal/adjust-rule-location'

export function documentationAt(
  content: string,
  offset: number,
  { isIgnored }: IntellisenseContext,
): DocumentationAt | null {
  let result: DocumentationAt | null = null

  parseHTML(content, (startIndex, endIndex, quote) => {
    if (startIndex <= offset && offset < endIndex) {
      // offset is within this classList
      const token = content.slice(startIndex, endIndex)

      // TODO: after fixClassList the positions maybe invalid
      const rules = parse(fixClassList(token, quote)) as ParsedDevRule[]

      for (const rule of rules) {
        const start = startIndex + rule.l[0]
        const end = startIndex + rule.l[1]

        if (start <= offset && offset < end) {
          // found our rule
          if (!isIgnored(rule.n)) {
            result = {
              ...adjustRuleLocation(token, rule, startIndex),
              value: toClassName(rule),
            }
          }

          return false
        }

        if (offset < end) {
          return false
        }
      }

      return false
    }

    if (offset < startIndex) {
      return false
    }
  })

  return result
}

export function collectColors(
  content: string,
  { classes, isIgnored }: IntellisenseContext,
): ColorInformation[] {
  const colors: ColorInformation[] = []

  parseHTML(content, (startIndex, endIndex, quote) => {
    const token = content.slice(startIndex, endIndex)
    const rules = parse(fixClassList(token, quote)) as ParsedDevRule[]

    for (const rule of rules) {
      if (isIgnored(rule.n)) continue

      const completion = classes.get(rule.n)

      if (completion?.color) {
        const color = parseColor(completion.color)

        if (color) {
          colors.push({
            ...adjustRuleLocation(token, rule, startIndex),
            value: completion.color,
            rgba: color,
          })

          continue
        }
      }

      const editableMatch = rule.n.match(editabelColorRe)

      if (editableMatch) {
        const { 1: currentColor } = editableMatch
        const color = parseColor(currentColor)

        if (color) {
          colors.push({
            ...adjustRuleLocation(token, rule, startIndex),
            value: currentColor,
            rgba: color,
            editable: true,
          })

          continue
        }
      }
    }
  })

  return colors
}

export function validate(
  content: string,
  { variants, classes, isIgnored, generateCSS }: IntellisenseContext,
): Diagnostics[] {
  const diagnostics: Diagnostics[] = []

  parseHTML(content, (startIndex, endIndex, quote) => {
    const token = content.slice(startIndex, endIndex)
    const rules = parse(fixClassList(token, quote)) as ParsedDevRule[]

    for (const rule of rules) {
      if (isIgnored(rule.n)) continue

      const css = generateCSS(rule.n)

      const ast = csstree.parse(css, {
        positions: false,
        parseAtrulePrelude: false,
        parseRulePrelude: false,
        parseValue: false,
        parseCustomProperty: false,
        onParseError(error) {
          diagnostics.push({
            ...adjustRuleLocation(token, rule, startIndex),
            code: 'invalidCSS',
            message: `Failed to parse CSS of class ${JSON.stringify(rule.n)}: ${error.message}`,
            severity: 'error',
            value: rule.n,
          })
        },
      })

      if (ast) {
        // TODO: csstree-validator uses createRequire to fetch mdn-data -> this does not work in the browser
        // if (typeof document !== 'object') {
        //   const cssValidator = await import('csstree-validator')

        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //   for (const error of cssValidator.validate(ast)) {
        //     diagnostics.push({
        //       ...adjustRuleLocation(token, rule, startIndex),
        //       code: 'invalidCSS',
        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //       message: error.message,
        //       severity: 'warning',
        //       value: rule.n,
        //     })
        //   }
        // }

        if (typeof document == 'object') {
          csstree.walk(ast, {
            visit: 'SelectorList',
            enter(node) {
              const selector = csstree.generate(node)
              try {
                document.querySelector(selector)
              } catch (error) {
                // Some thrown errors are because of specific pseudo classes
                // lets filter them to prevent unnecessary warnings
                // ::-moz-focus-inner
                // :-moz-focusring
                if (/:(-webkit-|-moz-|-ms-)/.test(selector)) {
                  diagnostics.push({
                    ...adjustRuleLocation(token, rule, startIndex),
                    code: 'invalidCSS',
                    message: `Vendor specific selector ${JSON.stringify(
                      selector,
                    )} for class ${JSON.stringify(rule.n)}`,
                    severity: 'hint',
                    value: rule.n,
                  })
                } else {
                  diagnostics.push({
                    ...adjustRuleLocation(token, rule, startIndex),
                    code: 'invalidCSS',
                    message: `Invalid selector ${JSON.stringify(
                      selector,
                    )} for class ${JSON.stringify(rule.n)}`,
                    severity: 'warning',
                    value: rule.n,
                  })
                }
              }
            },
          })
        }
      }

      if (!(classes.has(rule.n) || css)) {
        diagnostics.push({
          ...adjustRuleLocation(token, rule, startIndex),
          code: 'invalidClass',
          message: `Invalid class ${JSON.stringify(rule.n)}`,
          severity: 'error',
          value: rule.n,
        })
      }

      for (const variant of rule.v) {
        const className = variant + ':' + rule.n
        if (isIgnored(className)) continue

        const css = generateCSS(className)

        const ast = csstree.parse(css, {
          positions: false,
          parseAtrulePrelude: false,
          parseRulePrelude: false,
          parseValue: false,
          parseCustomProperty: false,
          onParseError(error) {
            diagnostics.push({
              ...adjustRuleLocation(token, rule, startIndex),
              code: 'invalidCSS',
              message: `Failed to parse CSS of variant ${JSON.stringify(variant)}: ${
                error.message
              }`,
              severity: 'error',
              value: rule.n,
            })
          },
        })

        if (ast) {
          if (typeof document == 'object') {
            csstree.walk(ast, {
              visit: 'SelectorList',
              enter(node) {
                const selector = csstree.generate(node)
                try {
                  document.querySelector(selector)
                } catch {
                  // Some thrown errors are because of specific pseudo classes
                  // lets filter them to prevent unnecessary warnings
                  // ::-moz-focus-inner
                  // :-moz-focusring
                  if (/:(-webkit-|-moz-|-ms-)/.test(selector)) {
                    diagnostics.push({
                      ...adjustRuleLocation(token, rule, startIndex),
                      code: 'invalidCSS',
                      message: `Vendor specific selector ${JSON.stringify(
                        selector,
                      )} for variant ${JSON.stringify(variant)}`,
                      severity: 'hint',
                      value: rule.n,
                    })
                  } else {
                    diagnostics.push({
                      ...adjustRuleLocation(token, rule, startIndex),
                      code: 'invalidCSS',
                      message: `Invalid selector ${JSON.stringify(
                        selector,
                      )} for variant ${JSON.stringify(variant)}`,
                      severity: 'warning',
                      value: rule.n,
                    })
                  }
                }
              },
            })
          }
        }

        if (!(variants.has(variant + ':') || css)) {
          diagnostics.push({
            ...adjustRuleLocation(token, rule, startIndex),
            code: 'invalidVariant',
            message: `Invalid variant ${JSON.stringify(variant)}`,
            severity: 'error',
            value: variant,
          })
        }
      }
    }
  })

  return diagnostics
}

export function extractBoundary(content: string, position: number): Boundary | null {
  return (
    find(`class="`, /[^\\]"/) ||
    find(`class='`, /[^\\]'/) ||
    find(`class=`, /[\s"'`=;>]/) ||
    // svelte class toggle
    // 'class:...',
    find(`class:`, /[\s"'/=]/)
  )

  function find(search: string, invalid: RegExp, before = /\s/): Boundary | null {
    const startIndex = content.lastIndexOf(search, position)

    // found and the char before is a white space
    if (startIndex !== -1 && before.test(content[startIndex - 1])) {
      const boundary = content.slice(startIndex + search.length, position)

      // maybe an expression like class="{...}"
      // TODO: for now ignore expression
      if (/{/.test(boundary[0])) {
        return null
      }

      if (invalid.test(boundary)) {
        return null
      }

      return { start: startIndex + search.length, end: position, content: boundary }
    }

    return null
  }
}
