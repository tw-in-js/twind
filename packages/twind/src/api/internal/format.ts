import type { ParsedRule } from './parse'
import { toClassName } from './to-class-name'

export function format(rules: ParsedRule[], space = ' '): string {
  // TODO generate minified shortcut name:
  // input:    hover:~(!text-(3xl center) !underline italic focus:not-italic)
  // current:  ~(hover:!text-3xl,hover:!text-center,hover:!underline,hover:italic,hover:focus:not-italic)
  // minified: hover:~(!text-(3xl,center),!underline,italic,focus:not-italic)
  // const input = [
  //   {name: 'text-3xl', variants: ['hover'], important: true},
  //   {name: 'text-center', variants: ['hover'], important: true},
  //   {name: 'underline', variants: ['hover'], important: true},
  //   {name: 'italic', variants: ['hover'], important: false},
  //   {name: 'not-italic', variants: ['hover', 'focus'], important: false},
  // ]

  return rules
    .map((rule) =>
      Array.isArray(rule)
        ? (space == ',' ? '' : '~(') + format(rule, ',') + (space == ',' ? '' : ')')
        : toClassName(rule),
    )
    .join(space)
}
