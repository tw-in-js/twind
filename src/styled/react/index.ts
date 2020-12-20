import * as React from 'react'

import type { TW } from '../../index'
import type { StyledContext, WithTags, Styled as BaseStyled, ForwardRef } from '../index'

import { bind, styled as $styled } from '../index'

export type ReactResult = ReturnType<typeof React.createElement>

const context: StyledContext<ReactResult> = {
  createElement: React.createElement,
  forwardRef: React.forwardRef as ForwardRef,
}

bind(context)

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Styled extends WithTags<BaseStyled<ReactResult>> {}

export interface Styled$ extends Styled {
  bind: (tw: TW) => Styled
}

export const styled: Styled$ = $styled.bind(context)

styled.bind = (tw) => $styled.bind({ ...context, tw })
