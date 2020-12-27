/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { Token, TW, Context } from '../types'

import { tw as defaultTW, hash } from '../index'
import * as is from '../internal/is'

export interface Pragma<HResult = HResultDefault> {
  (type: any, props: {}, ...children: any[]): HResult
}

export interface BaseProps {
  as?: Tag | StyledComponent
  class?: string
  className?: string
  children?: any
}

export type StyledProps<P = PropsDefault> = P & BaseProps

export type PropsWithRef<P = PropsDefault> = P & { ref?: any }

export interface MutableRefObject<T> {
  current: T
}

export type ForwardedRef<T = RefDefault> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null

export interface ForwardRefRenderFunction<T = RefDefault, P = PropsDefault> {
  (props: StyledProps<P>, ref: ForwardedRef<T>): any

  displayName?: string
  // explicit rejected with `never` required due to
  // https://github.com/microsoft/TypeScript/issues/36826
  /**
   * defaultProps are not supported on render functions
   */
  defaultProps?: never
}

export interface ForwardRef {
  <Ref = RefDefault, Props = PropsDefault, HResult = HResultDefault>(
    render: ForwardRefRenderFunction<Ref, Props>,
  ): (props: Props) => HResult
}

export type PropsDefault = {}
export type RefDefault = any
export type HResultDefault = any

export interface StyledComponent<Props = PropsDefault, Ref = RefDefault, HResult = HResultDefault> {
  (props: StyledProps<Props>, ref?: ForwardedRef<Ref>): HResult
  // propTypes?: WeakValidationMap<P>;
  // contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<StyledProps<Props>>
  displayName?: string

  attrs<A extends Props = Props>(attrs: Attrs<Props, A>): StyledComponent<Props & A, Ref, HResult>

  /**
   * Returns the marker class as a selector: `.tw-xxx`
   */
  toString(): string
}

export interface StyleFactory<P = PropsDefault> {
  (props: StyledProps<P>, context: Context): Token
}

export type Attrs<P = PropsDefault, A extends P = P> =
  | A
  | ((props: StyledProps<P>) => Partial<StyledProps<A>>)

export interface PartialStyledComponent<
  Props = PropsDefault,
  Ref = RefDefault,
  HResult = HResultDefault
> {
  <A extends Props = Props>(
    strings: TemplateStringsArray,
    ...interpolations: (Token | StyleFactory<A>)[]
  ): StyledComponent<Props & A, Ref, HResult>

  <A extends Props = Props>(factory: StyleFactory<A>): StyledComponent<Props & A, Ref, HResult>

  <A extends Props = Props>(token: Token, ...tokens: (Token | StyleFactory<A>)[]): StyledComponent<
    Props & A,
    Ref,
    HResult
  >

  attrs<A extends Props>(attrs: Attrs<Props, A>): PartialStyledComponent<Props & A, Ref, HResult>
}

export interface Styled<HResult = HResultDefault> {
  <P = PropsDefault, R = RefDefault, H = HResult>(
    this: StyledContext<H> | Pragma<H> | null | undefined | void,
    tag: Tag,
  ): PartialStyledComponent<P, R, H>

  <P = PropsDefault, R = RefDefault, H = HResult>(
    this: StyledContext<HResult> | Pragma<HResult> | null | undefined | void,
    tag: StyledComponent<P, R, H>,
  ): PartialStyledComponent<P, R, H>
}

export interface UnboundStyled<HResult = HResultDefault> extends Styled<HResult> {
  bind<H = HResult>(context: StyledContext<H>): WithTags<Styled<H>>
  bind<H = HResult>(h: Pragma<H>, tw?: TW): WithTags<Styled<H>>
}

export interface StyledContext<HResult = HResultDefault> {
  createElement: Pragma<HResult>
  forwardRef?: ForwardRef
  tw?: TW
}

const contextCache = new WeakMap<TW, Context>()

const getContext = (tw: TW): Context => {
  let context = contextCache.get(tw)

  if (!context) {
    tw((_) => {
      context = _
      return ''
    })

    contextCache.set(tw, (context as unknown) as Context)
  }

  return context as Context
}

const ESCAPE = {} as const

const detectInlinePlugins: ProxyHandler<{}> = {
  get(target, prop, receiver) {
    if (!Reflect.has(target, prop) && ~['tw', 'theme', 'tag'].indexOf(prop as string)) {
      throw ESCAPE
    }

    return Reflect.get(target, prop, receiver)
  },
}

const build = <P = PropsDefault>(tw: TW, tokens: unknown[]): ((props: P) => string) => {
  if (tokens.some(is.function)) {
    const interpolations = tokens.map((token) => {
      if (is.function(token)) {
        // If this function uses tw, theme or tag it is most likely an inline plugin
        // and we keep it as is
        // Otherwise it maybe just a string interpolation
        return (props: P, context: Context): Token => {
          if (token.length > 1) {
            // (props, { tw }) => tw`...`
            return (context) => token(props, context)
          }

          try {
            return token(props, context)
          } catch (error) {
            if (error === ESCAPE) {
              return token as Token
            }

            throw error
          }
        }
      }

      return () => token as Token
    })

    return (props) => {
      const proxy = new Proxy(props, detectInlinePlugins) as P
      const context = getContext(tw)

      return tw(...interpolations.map((fn) => fn(proxy, context)))
    }
  }

  // Static styles => invoke tw only once
  let result: string

  return () => result || (result = tw(tokens as Token[]))
}

const stringifyFunctions = (key: string, value: any): unknown => {
  if (is.function(value)) {
    return {
      t: 'function',
      n: value.name,
      d: value.displayName,
      s: is.function(value.toJSON) ? value.toJSON() : value.toString(),
    }
  }

  return value
}

const mergeAttrs = (props: any, attrs: any): any => {
  if (is.function(attrs)) {
    attrs = attrs(props)
  }

  // eslint-disable-next-line guard-for-in
  for (const key in attrs) {
    props[key] =
      key === 'className' || key === 'class'
        ? [props[key], attrs[key]].filter(Boolean).join(' ')
        : key === 'style'
        ? { ...props[key], ...attrs[key] }
        : attrs[key]
  }

  return props
}

const create = (
  context: StyledContext,
  tag: Tag | StyledComponent,
  attrs: Attrs[],
  tokens: unknown[],
): StyledComponent => {
  const { createElement, forwardRef, tw = defaultTW } = context

  const targetClassName = hash(JSON.stringify([tag, attrs, tokens], stringifyFunctions))

  const evaluate = build(tw, tokens)

  const forwardAsProp = !is.string(tag)

  let Styled = ((props, ref) => {
    // console.log('Styled', {tag, attrs, tokens, targetClassName, props})

    // Apply attrs
    if (attrs.length) {
      props = attrs.reduce(mergeAttrs, { ...props })
    }

    // eslint-disable-next-line prefer-const
    let { as = tag, class: className, ...$props } = props

    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;($props as BaseProps).className = [
      className,
      $props.className as string,
      targetClassName,
      evaluate($props),
    ]
      .filter(Boolean)
      .join(' ')

    // If forwardRef is defined we have the ref
    if (forwardRef) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;($props as PropsWithRef).ref = ref
    }

    if (forwardAsProp) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;($props as BaseProps).as = as
      as = tag as any
    }

    return createElement(as, $props)
  }) as StyledComponent

  Styled.displayName = `Styled(${
    is.string(tag) ? tag : (tag as any).displayName || (tag as any).name || 'Component'
  })`

  if (!is.string(tag)) {
    Styled.defaultProps = (tag as any).defaultProps
  }

  if (forwardRef) {
    Styled = forwardRef(Styled as any) as any
  }

  Styled.attrs = (newAttrs) => create(context, tag, [...attrs, newAttrs] as any, tokens) as any

  const toString = () => `.${targetClassName}`

  Object.defineProperties(Styled, {
    toString: { value: toString },
    toJSON: { value: toString },
  })

  return Styled
}

let styledContext: StyledContext = {
  createElement: (): never => {
    throw new Error('Missing createElement. Call setup or bind before styled.')
  },

  tw: defaultTW,
}

const createStyledContext = <HResult = HResultDefault>(
  context: StyledContext<HResult> | Pragma<HResult>,
  tw = styledContext.tw,
): StyledContext<HResult> => ({
  tw,
  ...(is.function(context) ? { createElement: context } : context),
})

export const bind = (context: StyledContext | Pragma, tw?: TW): void => {
  styledContext = { ...styledContext, ...createStyledContext(context, tw) }
}

export type WithTags<T extends Styled> = T &
  {
    readonly [P in keyof Tags]: T extends Styled<infer HResult>
      ? PartialStyledComponent<PropsDefault, RefDefault, HResult>
      : never
  }

const tagHandler: ProxyHandler<Styled> = {
  get(target, tag, receiver) {
    if (typeof tag !== 'string' || tag === 'bind') {
      return Reflect.get(target, tag, receiver)
    }

    return target.call((receiver === target ? undefined : receiver) as any, tag as any)
  },
}

const withTags = <T extends Styled>(styled: T): WithTags<T> => new Proxy(styled, tagHandler) as any

const partial = (
  context: StyledContext,
  tag: Tag | StyledComponent,
  attrs: Attrs[],
): PartialStyledComponent => {
  const PartialStyledComponent = ((...tokens: unknown[]) =>
    create(context, tag, attrs, tokens)) as PartialStyledComponent

  PartialStyledComponent.attrs = (newAttrs) =>
    partial(context, tag, [...attrs, newAttrs] as any) as any

  return PartialStyledComponent
}

export const styled = withTags(function <HResult = HResultDefault>(
  this: StyledContext<HResult> | Pragma<HResult> | null | undefined | void,
  tag: Tag | StyledComponent,
) {
  return partial(this ? createStyledContext(this) : styledContext, tag, [])
} as UnboundStyled)

styled.bind = function <HResult>(
  context: StyledContext<HResult> | Pragma<HResult>,
  tw?: TW,
): WithTags<Styled<HResult>> {
  return withTags(
    Function.prototype.bind.call(styled, createStyledContext(context, tw)) as Styled<HResult>,
  )
}

/** Exposed as an interface to allow extensions by client packages */
export interface Tags {
  a: true
  abbr: true
  address: true
  area: true
  article: true
  aside: true
  audio: true
  b: true
  base: true
  bdi: true
  bdo: true
  big: true
  blockquote: true
  body: true
  br: true
  button: true
  canvas: true
  caption: true
  cite: true
  code: true
  col: true
  colgroup: true
  data: true
  datalist: true
  dd: true
  del: true
  details: true
  dfn: true
  dialog: true
  div: true
  dl: true
  dt: true
  em: true
  embed: true
  fieldset: true
  figcaption: true
  figure: true
  footer: true
  form: true
  h1: true
  h2: true
  h3: true
  h4: true
  h5: true
  h6: true
  head: true
  header: true
  hgroup: true
  hr: true
  html: true
  i: true
  iframe: true
  img: true
  input: true
  ins: true
  kbd: true
  keygen: true
  label: true
  legend: true
  li: true
  link: true
  main: true
  map: true
  mark: true
  marquee: true
  menu: true
  menuitem: true
  meta: true
  meter: true
  nav: true
  noscript: true
  object: true
  ol: true
  optgroup: true
  option: true
  output: true
  p: true
  param: true
  picture: true
  pre: true
  progress: true
  q: true
  rp: true
  rt: true
  ruby: true
  s: true
  samp: true
  script: true
  section: true
  select: true
  small: true
  source: true
  span: true
  strong: true
  style: true
  sub: true
  summary: true
  sup: true
  table: true
  tbody: true
  td: true
  textarea: true
  tfoot: true
  th: true
  thead: true
  time: true
  title: true
  tr: true
  track: true
  u: true
  ul: true
  var: true
  video: true
  wbr: true

  // SVG
  circle: true
  clipPath: true
  defs: true
  ellipse: true
  foreignObject: true
  g: true
  image: true
  line: true
  linearGradient: true
  mask: true
  path: true
  pattern: true
  polygon: true
  polyline: true
  radialGradient: true
  rect: true
  stop: true
  svg: true
  text: true
  tspan: true
}

export type Tag = keyof Tags
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
