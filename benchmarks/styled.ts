import Benchmark from 'benchmark'

import * as React from 'react'
import { renderToString as render } from 'react-dom/server'

import { css } from '../src/css'
import { styled } from '../src/styled/react'

import { styled as goober, setup as setupGoober } from 'goober'
import { version as gooberVersion } from 'goober/package.json'

import emotion from '@emotion/styled'
import { version as emotionVersion } from '@emotion/styled/package.json'

import styledComponents from 'styled-components'
import { version as styledComponentsVersion } from 'styled-components/package.json'

setupGoober(React.createElement)

interface Props {
  color: string
  random: number
}

function renderComponent(Component) {
  return render(React.createElement(Component, { color: 'black', random: Math.random() }))
}

// Run the benchmarks
;(async function run() {
  await objectStyles()
  await templateLiteralStyles()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})

function objectStyles() {
  const styles = (props: Props) => ({
    display: 'inline-block',
    borderRadius: '3px',
    padding: '0.5rem 0',
    margin: '0.5rem 1rem',
    width: '11rem',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',

    '&:hover': {
      color: props.color,
      opacity: props.random > 0.5 ? 1 : 0,
    },

    '&:focus': {
      border: '2px dashed black',
    },

    fontSize: '0.875rem',
    lineHeight: '1.25rem',

    '@media (min-width: 768px)': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },

    '@media (min-width: 1280px)': {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    },
  })

  const twindComponent = styled('div')((props: Props) => css(styles(props)))
  const gooberComponent = goober('div')(styles)
  const emotionComponent = emotion('div')(styles)
  const styledComponentsComponent = styledComponents('div')(styles)

  console.log('# Object Styles')
  console.log('twind:', renderComponent(twindComponent))
  console.log('goober:', renderComponent(gooberComponent))
  console.log('emotion:', renderComponent(emotionComponent))
  console.log('styled-components:', renderComponent(styledComponentsComponent))

  return new Promise((resolve, reject) => {
    new Benchmark.Suite('Object Styles')
      .add('twind', () => renderComponent(twindComponent))
      .add(`goober@${gooberVersion}`, () => renderComponent(gooberComponent))
      .add(`emotion@${emotionVersion}`, () => renderComponent(emotionComponent))
      .add(`styled-components@${styledComponentsVersion}`, () =>
        renderComponent(styledComponentsComponent),
      )
      .on('error', reject)
      .on('cycle', function (event) {
        console.log(String(event.target))
      })
      .on('complete', function () {
        const fastest = this.filter('fastest').map('name')[0]
        console.log('')
        console.log('Fastest is: ' + fastest)
        console.log('')
        resolve()
      })
      .run()
  })
}

function templateLiteralStyles(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles = (impl) => impl`
    display: inline-block;
    border-radius: 3px;
    padding: 0.5rem 0;
    margin: 0.5rem 1rem;
    width: 11rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    &:hover {
      color: ${(props) => props.color};
      opacity: ${(props) => (props.random > 0.5 ? 1 : 0)};
    }
    &:focus {
      border: 2px dashed black;
    }

    font-size: 0.875rem;
    line-height: 1.25rem;

    @media (min-width: 768px) {
      font-size: 1rem;
      line-height: 1.5rem;
    }

    @media (min-width: 1280px) {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
  `

  const twindComponent = styled.div`
    inline-block
    rounded
    py-2
    my-2 mx-4
    w-44
    bg-transparent
    text-white
    border(2 solid white)
    hover:(
      text-${(props: Props) => props.color}
      opacity-${(props: Props) => (props.random > 0.5 ? '100' : '0')}
    )
    focus:border(2 dashed black)
    text(sm md:base lg:lg)
  `

  const gooberComponent = styles(goober('div'))
  const emotionComponent = styles(emotion('div'))
  const styledComponentsComponent = styles(styledComponents('div'))

  console.log('# Template Literal Styles')
  console.log('twind:', renderComponent(twindComponent))
  console.log('goober:', renderComponent(gooberComponent))
  console.log('emotion:', renderComponent(emotionComponent))
  console.log('styled-components:', renderComponent(styledComponentsComponent))

  return new Promise((resolve, reject) => {
    new Benchmark.Suite('Template Literal Styles')
      .add('twind', () => renderComponent(twindComponent))
      .add(`goober@${gooberVersion}`, () => renderComponent(gooberComponent))
      .add(`emotion@${emotionVersion}`, () => renderComponent(emotionComponent))
      .add(`styled-components@${styledComponentsVersion}`, () =>
        renderComponent(styledComponentsComponent),
      )
      .on('error', reject)
      .on('cycle', function (event) {
        console.log(String(event.target))
      })
      .on('complete', function () {
        const fastest = this.filter('fastest').map('name')[0]
        console.log('')
        console.log('Fastest is: ' + fastest)
        console.log('')
        resolve()
      })
      .run()
  })
}
