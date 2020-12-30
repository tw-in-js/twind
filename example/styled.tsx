// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import { styled } from '../src/styled/preact/index'

const Main = styled.main`h-screen bg-purple-400 flex items-center justify-center`
const H1 = styled.h1`font-bold text(center 5xl white sm:gray-800 md:pink-700)`

render(
  <Main>
    <H1>This is Twind!</H1>
  </Main>,
  document.body,
)
