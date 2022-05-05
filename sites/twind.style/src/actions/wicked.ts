import type { Action, ActionResult } from './types'

export type WickedParameters = Record<string, string | undefined>

export type WickedParametersFromAttributesCallback<Parameters = WickedParameters> = (
  node: Element,
) => Parameters

type PossibleAttributeValueKeys<T> = keyof {
  [Key in keyof T]: Key extends string
    ? T[Key] extends string | null | undefined
      ? string | undefined
      : never
    : never
}

export type WickedParametersFromAttributes<Parameters = WickedParameters> =
  | PossibleAttributeValueKeys<Parameters>[]
  | { [attributeName: string]: PossibleAttributeValueKeys<Parameters> }
  | WickedParametersFromAttributesCallback<Parameters>
  | null

export type WickedConfigItem<Parameters = WickedParameters> =
  | [
      selector: string,
      action: WickedAction<Parameters>,
      attributes?: WickedParametersFromAttributes<Parameters>,
    ]

export type WickedAction<Parameters = WickedParameters> = (
  node: Element,
  parameters: Parameters,
) => WickedActionResult<Parameters> | void | undefined | null

export interface WickedActionResult<Parameters = WickedParameters> {
  update?: (parameters: Parameters) => void
  destroy?: () => void
}

export function withOptions<
  Options extends Record<string, any>,
  Parameters = WickedParameters,
  Action extends WickedAction<Parameters & Options> = WickedAction<Parameters & Options>,
>(action: Action, options: Parameters): Action {
  return function withOptions$(node, parameters) {
    const { update, destroy } = action(node, { ...options, ...parameters }) || {}

    return {
      update(parameters) {
        update?.({ ...options, ...parameters })
      },
      destroy,
    }
  } as Action
}

export type LazyLoader<Parameters = WickedParameters> = () => Promise<
  WickedAction<Parameters> | { default: WickedAction<Parameters> }
>

export function lazy<Parameters = WickedParameters>(
  load: LazyLoader<Parameters>,
): WickedAction<Parameters> {
  let action: WickedAction<Parameters> | undefined
  let pending: Promise<WickedAction<Parameters>> | undefined

  return function lazy$(node, parameters) {
    if (action) return action(node, parameters)

    let result: WickedActionResult<Parameters> | void | undefined | null
    let alive = true

    if (!pending) {
      pending = load().then(
        (module) => (action = typeof module === 'function' ? module : module.default),
      )
    }

    pending.then((action) => {
      if (alive) {
        result = action(node, parameters)
      }
    })

    return {
      update(newParameters) {
        parameters = newParameters
        result?.update?.(newParameters)
      },
      destroy() {
        alive = false
        result?.destroy?.()
      },
    }
  }
}

interface Registration {
  _: void | undefined | null | WickedActionResult
  e: Element
  // s: string
  a: WickedParametersFromAttributesCallback
  f: string[] | null
}

// Inpsired by https://github.com/WebReflection/wicked-elements
export function wicked(
  node: Element,
  initialConfig: WickedConfigItem[],
): ActionResult<WickedConfigItem[]> {
  const live = new Map<Element, Registration[]>()

  let config: [
    selector: string,
    action: WickedAction,
    attributes: WickedParametersFromAttributesCallback,
    attributeFilter: string[] | null,
  ][] = []

  const mo = new MutationObserver(handleChanges)

  // listen for added/removed nodes
  mo.observe(node, { childList: true, subtree: true })

  update(initialConfig)

  return { update, destroy }

  function handleChanges(records: MutationRecord[]) {
    const changed = new Set<Registration>()

    for (const record of records) {
      if (record.type == 'attributes') {
        live.get(node)?.forEach((registration) => {
          if (!registration.f || registration.f.includes(record.attributeName as string)) {
            changed.add(registration)
          }
        })
      } else {
        record.removedNodes.forEach((node) => {
          if ('querySelectorAll' in node) {
            unregister(node as Element)
          }
        })

        record.addedNodes.forEach((node) => {
          if ('querySelectorAll' in node) {
            register(node as Element)
          }
        })
      }
    }

    changed.forEach(({ _, e, a }) => _?.update?.(a(e)))
  }

  function register(root: Element) {
    for (const item of config) {
      if (root.matches(item[0])) {
        add(root, item)
      }

      root.querySelectorAll(item[0]).forEach((element) => add(element, item))
    }
  }

  function unregister(root: Element) {
    remove(root)
    root.querySelectorAll('*').forEach(remove)
  }

  function remove(element: Element) {
    const registrations = live.get(element)
    if (registrations) {
      live.delete(element)
      registrations.forEach(({ _ }) => _?.destroy?.())
    }
  }

  function add(
    element: Element,
    [, action, attributes, attributeFilter]: [
      selector: string,
      action: WickedAction,
      attributes: WickedParametersFromAttributesCallback,
      attributeFilter: string[] | null,
    ],
  ): void {
    let registrations = live.get(element)
    if (!registrations) {
      live.set(element, (registrations = []))
    }

    registrations.push({
      _: action(element, attributes(element)),
      e: element,
      // s: selector,
      a: attributes,
      f: attributeFilter,
    })

    const attributesFilter = registrations.reduce(
      (combined: Set<string> | undefined, { f: filter }) => {
        if (!filter) return undefined

        if (combined) {
          filter.forEach((attribute) => combined.add(attribute))
        }

        return combined
      },
      new Set<string>(),
    )

    let options: MutationObserverInit = {
      attributes: true,
      attributeFilter: attributesFilter && [...attributesFilter],
    }

    // ensure we keep listening for added/removed nodes
    if (element === node) {
      options = {
        ...options,
        childList: true,
        subtree: true,
      }
    }

    mo.observe(element, options)
  }

  function clear() {
    for (const element of live.keys()) {
      remove(element)
    }
  }

  function update(initialConfig: WickedConfigItem[]) {
    clear()

    config = initialConfig.map(([selector, action, attributes = []]) => {
      const attributeHandler = createAttributesHandler(attributes)

      const attributeFilter =
        typeof attributes === 'function'
          ? null
          : Array.isArray(attributes)
          ? attributes
          : attributes && Object.keys(attributes)

      return [selector, action, attributeHandler, attributeFilter]
    })

    register(node)
  }

  function destroy() {
    clear()
    config.length = 0
    mo.disconnect()
  }
}

function createAttributesHandler(
  attributes?: WickedParametersFromAttributes | undefined | null,
): WickedParametersFromAttributesCallback {
  if (typeof attributes === 'function') {
    return attributes
  }

  if (Array.isArray(attributes)) {
    return (node) =>
      Object.fromEntries(
        attributes.map((attribute) => [attribute, node.getAttribute(attribute) ?? undefined]),
      )
  }

  if (attributes) {
    return (node) =>
      Object.fromEntries(
        Object.entries(attributes).map(([attribute, parameter]) => [
          parameter,
          node.getAttribute(attribute) ?? undefined,
        ]),
      )
  }

  return (node) =>
    Object.fromEntries(Array.from(node.attributes, (attr) => [attr.name, attr.value]))
}
