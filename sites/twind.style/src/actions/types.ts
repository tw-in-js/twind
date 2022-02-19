export type Action = (
  node: HTMLElement,
  parameters: any,
) => {
  update: (parameters: any) => void
  destroy: () => void
}
