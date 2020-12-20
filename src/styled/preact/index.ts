import { h } from 'preact'

import type { TW } from '../../index'
import type { StyledContext, WithTags, Styled as BaseStyled } from '../index'

import { bind, styled as $styled } from '../index'

export type PreactResult = ReturnType<typeof h>

const context: StyledContext<PreactResult> = {
  createElement: h,
}

bind(context)

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Styled extends WithTags<BaseStyled<PreactResult>> {}

export interface Styled$ extends Styled {
  bind: (tw: TW) => Styled
}

export const styled: Styled$ = $styled.bind(context)

styled.bind = (tw) => $styled.bind({ ...context, tw })
