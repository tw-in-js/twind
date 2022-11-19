import { assert, beforeEach, test } from 'vitest'

import { twind, virtual } from '@twind/core'
import presetContainerQueries from './container-queries'

const tw = twind(
  {
    presets: [presetContainerQueries()],
    theme: {
      extend: {
        containers: {
          sm: '320px',
          md: '768px',
          lg: '1024px',
        },
      },
    },
    rules: [['underline', 'text-decoration-line']],
  },
  virtual(),
)

beforeEach(() => tw.clear())

test.each([
  // rules
  ['@container', '.\\@container{container-type:inline-size}'],
  ['@container-inline-size', '.\\@container-inline-size{container-type:inline-size}'],
  ['@container-normal', '.\\@container-normal{container-type:normal}'],
  ['@container-[size]', '.\\@container-\\[size\\]{container-type:size}'],
  ['@container-size', '.\\@container-size{container-type:size}'],
  [
    '@container/sidebar',
    '.\\@container\\/sidebar{container-type:inline-size;container-name:sidebar}',
  ],
  [
    '@container-normal/sidebar',
    '.\\@container-normal\\/sidebar{container-type:normal;container-name:sidebar}',
  ],
  [
    '@container-[size]/sidebar',
    '.\\@container-\\[size\\]\\/sidebar{container-type:size;container-name:sidebar}',
  ],

  // variants
  [
    '@xs:underline',
    '@container (min-width:20rem){.\\@xs\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@xs/sidebar:underline',
    '@container sidebar (min-width:20rem){.\\@xs\\/sidebar\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@md:underline',
    '@container (min-width:768px){.\\@md\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@md/sidebar:underline',
    '@container sidebar (min-width:768px){.\\@md\\/sidebar\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@xl:underline',
    '@container (min-width:36rem){.\\@xl\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@xl/sidebar:underline',
    '@container sidebar (min-width:36rem){.\\@xl\\/sidebar\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@7xl:underline',
    '@container (min-width:80rem){.\\@7xl\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@7xl/sidebar:underline',
    '@container sidebar (min-width:80rem){.\\@7xl\\/sidebar\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@[1024px]:underline',
    '@container (min-width:1024px){.\\@\\[1024px\\]\\:underline{text-decoration-line:underline}}',
  ],
  [
    '@[1024px]/sidebar:underline',
    '@container sidebar (min-width:1024px){.\\@\\[1024px\\]\\/sidebar\\:underline{text-decoration-line:underline}}',
  ],
])('%s => %s', (className, expected) => {
  assert.strictEqual(tw(className), className)

  assert.deepEqual(tw.target, [expected])
})

// TODO: sorted

test('sorted', () => {
  tw('@container')
  tw('@container-normal')
  tw('@container/sidebar')
  tw('@container-normal/sidebar')
  tw('@container-[size]/sidebar')

  tw('@md:underline')
  tw('@md/container1:underline')
  tw('@md/container2:underline')
  tw('@md/container10:underline')
  tw('@sm:underline')
  tw('@sm/container1:underline')
  tw('@sm/container2:underline')
  tw('@sm/container10:underline')
  tw('@lg:underline')
  tw('@lg/container1:underline')
  tw('@lg/container2:underline')
  tw('@lg/container10:underline')
  tw('@[1024px]:underline')
  tw('@[1024px]/container1:underline')
  tw('@[312px]:underline')
  tw('@[200rem]:underline')
  tw('@[123px]:underline')

  assert.deepEqual(tw.target, [
    '.\\@container-\\[size\\]\\/sidebar{container-type:size;container-name:sidebar}',
    '.\\@container-normal\\/sidebar{container-type:normal;container-name:sidebar}',
    '.\\@container\\/sidebar{container-type:inline-size;container-name:sidebar}',
    '.\\@container{container-type:inline-size}',
    '.\\@container-normal{container-type:normal}',
    '@container (min-width:123px){.\\@\\[123px\\]\\:underline{text-decoration-line:underline}}',
    '@container (min-width:312px){.\\@\\[312px\\]\\:underline{text-decoration-line:underline}}',
    '@container (min-width:320px){.\\@sm\\:underline{text-decoration-line:underline}}',
    '@container container1 (min-width:320px){.\\@sm\\/container1\\:underline{text-decoration-line:underline}}',
    '@container container2 (min-width:320px){.\\@sm\\/container2\\:underline{text-decoration-line:underline}}',
    '@container container10 (min-width:320px){.\\@sm\\/container10\\:underline{text-decoration-line:underline}}',
    '@container (min-width:768px){.\\@md\\:underline{text-decoration-line:underline}}',
    '@container container1 (min-width:768px){.\\@md\\/container1\\:underline{text-decoration-line:underline}}',
    '@container container2 (min-width:768px){.\\@md\\/container2\\:underline{text-decoration-line:underline}}',
    '@container container10 (min-width:768px){.\\@md\\/container10\\:underline{text-decoration-line:underline}}',
    '@container (min-width:1024px){.\\@\\[1024px\\]\\:underline{text-decoration-line:underline}}',
    '@container container1 (min-width:1024px){.\\@\\[1024px\\]\\/container1\\:underline{text-decoration-line:underline}}',
    '@container (min-width:1024px){.\\@lg\\:underline{text-decoration-line:underline}}',
    '@container container1 (min-width:1024px){.\\@lg\\/container1\\:underline{text-decoration-line:underline}}',
    '@container container2 (min-width:1024px){.\\@lg\\/container2\\:underline{text-decoration-line:underline}}',
    '@container container10 (min-width:1024px){.\\@lg\\/container10\\:underline{text-decoration-line:underline}}',
    '@container (min-width:200rem){.\\@\\[200rem\\]\\:underline{text-decoration-line:underline}}',
  ])
})
