import { assert, test, afterEach } from 'vitest'
import { twind, virtual } from 'twind'

import presetTailwind from '@twind/preset-tailwind'
import presetAutoprefix from '.'

const tw = twind(
  {
    presets: [presetAutoprefix(), presetTailwind({ disablePreflight: true })],
    variants: [['not-logged-in', 'body:not(.logged-in) &']],
  },
  virtual(),
)

afterEach(() => tw.clear())

test('add prefix', () => {
  assert.deepEqual(
    tw('snap-x appearance-menulist-button sticky'),
    'snap-x appearance-menulist-button sticky',
  )
  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-scroll-snap-strictness:proximity}',
    '.appearance-menulist-button{-webkit-appearance:menulist-button;-moz-appearance:menulist-button;-ms-appearance:menulist-button;appearance:menulist-button}',
    '.sticky{position:-webkit-sticky;position:sticky}',
    '.snap-x{-webkit-scroll-snap-type:x var(--tw-scroll-snap-strictness);-ms-scroll-snap-type:x var(--tw-scroll-snap-strictness);scroll-snap-type:x var(--tw-scroll-snap-strictness)}',
  ])
})

test('add prefix with important', () => {
  assert.deepEqual(
    tw('!snap-x !appearance-menulist-button !sticky'),
    '!snap-x !appearance-menulist-button !sticky',
  )

  assert.deepEqual(tw.target, [
    '*,::before,::after{--tw-scroll-snap-strictness:proximity}',
    '.\\!appearance-menulist-button{-webkit-appearance:menulist-button !important;-moz-appearance:menulist-button !important;-ms-appearance:menulist-button !important;appearance:menulist-button !important}',
    '.\\!sticky{position:-webkit-sticky !important;position:sticky !important}',
    '.\\!snap-x{-webkit-scroll-snap-type:x var(--tw-scroll-snap-strictness) !important;-ms-scroll-snap-type:x var(--tw-scroll-snap-strictness) !important;scroll-snap-type:x var(--tw-scroll-snap-strictness) !important}',
  ])
})
