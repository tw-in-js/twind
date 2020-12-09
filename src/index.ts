import { create } from './instance'

const instance = create()

export const { tw } = instance
export const { setup } = instance

export { create }
export * from './injectors'
export * from './modes'
export * from './prefix'

export * from './types'
