const is = (value: unknown, type: string): boolean => typeof value === type

export const string = (value: unknown): value is string => is(value, 'string')

// eslint-disable-next-line @typescript-eslint/ban-types
export const object = (value: unknown): value is object => value != null && is(value, 'object')

export const array = Array.isArray

// eslint-disable-next-line @typescript-eslint/ban-types
const fn = <T extends Function>(value: unknown): value is T => is(value, 'function')

export { fn as function }

export const browser = typeof window !== 'undefined'
