export const string = (value: unknown): value is string => typeof value === 'string'

// eslint-disable-next-line @typescript-eslint/ban-types
export const object = (value: unknown): value is object =>
  value != null && typeof value === 'object'

// eslint-disable-next-line @typescript-eslint/ban-types
const fn = <T extends Function>(value: unknown): value is T => typeof value === 'function'

export { fn as function }
