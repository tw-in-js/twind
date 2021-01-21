/* eslint-env node */
import Benchmark from 'benchmark'

import { tw, apply } from '../src'
import { css } from '../src/css'

import { css as otion } from 'otion'
import { version as otionVersion } from 'otion/package.json'

import { css as goober } from 'goober'
import { version as gooberVersion } from 'goober/package.json'

import { css as emotion } from '@emotion/css'
import { version as emotionVersion } from '@emotion/css/package.json'

// Run the benchmarks
;(async function run() {
  await objectStyles()
  await templateLiteralStyles()
})().catch((error) => {
  console.error(error)
  process.exit(1)
})

function objectStyles(): Promise<void> {
  const color = 'black'

  const styles = () => ({
    display: 'inline-block',
    borderRadius: '3px',
    padding: '0.5rem 0',
    margin: '0.5rem 1rem',
    width: '11rem',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',

    '&:hover': {
      color,
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

  console.log('# Object Styles')
  console.log('twind (inline static):', tw(styles))
  console.log(
    'twind (inline dynamic):',
    tw(() => styles()),
  )
  console.log('twind (css):', tw(css(styles())))
  console.log('otion:', otion(styles()))
  console.log('goober:', goober(styles()))
  console.log('emotion:', emotion(styles()))

  return new Promise((resolve, reject) => {
    new Benchmark.Suite('Object Styles')
      .add('twind (inline static)', () => tw(styles))
      .add('twind (inline dynamic)', () => tw(() => styles()))
      .add('twind (css)', () => tw(css(styles())))
      .add(`otion@${otionVersion}`, () => otion(styles()))
      .add(`goober@${gooberVersion}`, () => goober(styles()))
      .add(`emotion@${emotionVersion}`, () => emotion(styles()))
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
  const color = 'black'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles = (impl: (template: TemplateStringsArray, ...args: any[]) => any): any => impl`
    display: inline-block;
    border-radius: 3px;
    padding: 0.5rem 0;
    margin: 0.5rem 1rem;
    width: 11rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    &:hover {
      color: ${color};
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

  console.log('# Template Literal Styles')
  console.log(
    'twind (tw):',
    tw`
      inline-block
      rounded
      py-2
      my-2 mx-4
      w-44
      bg-transparent
      text-white
      border(2 solid white)
      hover:text-${color}
      focus:border(2 dashed black)
      text(sm md:base lg:lg)
    `,
  )

  console.log(
    'twind (apply):',
    tw(apply`
      inline-block
      rounded
      py-2
      my-2 mx-4
      w-44
      bg-transparent
      text-white
      border(2 solid white)
      hover:text-${color}
      focus:border(2 dashed black)
      text(sm md:base lg:lg)
    `),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const twind = (...args: any[]): string => tw(css(...args))

  console.log('twind (css):', styles(twind))
  console.log('goober:', styles(goober))
  console.log('emotion:', styles(emotion))

  return new Promise((resolve, reject) => {
    new Benchmark.Suite('Template Literal')
      .add(
        'twind (tw)',
        () =>
          tw`
            inline-block
            rounded
            py-2
            my-2 mx-4
            w-44
            bg-transparent
            text-white
            border(2 solid white)
            hover:text-${color}
            focus:border(2 dashed black)
            text(sm md:base lg:lg)
          `,
      )
      .add('twind (apply)', () =>
        tw(apply`
            inline-block
            rounded
            py-2
            my-2 mx-4
            w-44
            bg-transparent
            text-white
            border(2 solid white)
            hover:text-${color}
            focus:border(2 dashed black)
            text(sm md:base lg:lg)
          `),
      )
      .add(`twind (css)`, () => styles(twind))
      .add(`goober@${gooberVersion}`, () => styles(goober))
      .add(`emotion@${emotionVersion}`, () => styles(emotion))
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
