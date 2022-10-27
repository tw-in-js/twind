export type PureAction = (node: HTMLElement) => void

export interface ActionResult<Parameters = any> {
  update: (parameters: Parameters) => void
  destroy: () => void
}

export type Action<Parameters = any> = (
  node: HTMLElement,
  parameters: Parameters,
) => ActionResult<Parameters>

export interface UnknownActionResult<Parameters = any> {
  update?: (parameters?: Parameters) => void
  destroy?: () => void
}

export type UnknownAction<Parameters = any> = (
  node: HTMLElement,
  parameters?: Parameters,
) => void | undefined | null | UnknownActionResult<Parameters>
