import { Twind, BaseTheme, TwindConfig, cx, Class } from '@twind/core'
import { twind, cssom, observe } from '@twind/core'

let active: Twind | undefined

export function runtime<Theme extends BaseTheme = BaseTheme>(
  config: TwindConfig<Theme>,
  target?: HTMLElement,
): Twind<Theme, CSSStyleSheet> {
  active?.destroy()

  return (active = observe(twind(config, cssom()), target))
}

export function apply(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  return '~{' + cx(strings, ...interpolations) + '}'
}

export function tw(strings: TemplateStringsArray | Class, ...interpolations: Class[]): string {
  const tokens = cx(strings, ...interpolations)
  return active ? active.inject(tokens) : tokens
}

// TODO theme function
export function theme() {
  // return active?.theme(...args)
}
