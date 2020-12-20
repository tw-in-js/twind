import { create } from './instance'

const instance = create()

export const { tw } = instance
export const { setup } = instance
export const { theme } = instance

export { create }
export * from './injectors'
export * from './modes'
export * from './prefix'
export { cyrb32 as hash } from './internal/util'

export * from './types'
