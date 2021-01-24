import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'

import { create, strict } from '../index'
import { apply, css } from '../css'

const test = suite<{
  sheet: VirtualSheet
  tw: Instance['tw']
}>('hash')

test.before((context) => {
  context.sheet = virtualSheet()
  const { tw } = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    hash: true,
    prefix: false,
    theme: { extend: { colors: { primary: '#0d3880', '#0d3880': '#0d3880' } } },
  })
  context.tw = tw
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('class names are hashed', ({ tw, sheet }) => {
  assert.is(tw('group flex pt-4 text-center'), 'tw-1bk5mm5 tw-bibj42 tw-aysv3w tw-10s9vuy')
  assert.equal(sheet.target, [
    '.tw-bibj42{display:flex}',
    '.tw-aysv3w{padding-top:1rem}',
    '.tw-10s9vuy{text-align:center}',
  ])
})

test('keyframes are hashed', ({ tw, sheet }) => {
  assert.is(tw('animate-pulse'), 'tw-j3t2kc')
  assert.equal(sheet.target, [
    '@keyframes tw-sktrkv{0%,100%{opacity:1}50%{opacity:.5}}',
    '.tw-j3t2kc{animation:tw-sktrkv 2s cubic-bezier(0.4, 0, 0.6, 1) infinite}',
  ])
})

test('accept already hashed rules', ({ tw, sheet }) => {
  assert.is(tw('tw-1bk5mm5 tw-bibj42'), 'tw-1bk5mm5 tw-bibj42')
  assert.equal(sheet.target, [])
})

test('already hashed rule can not have variants', ({ tw }) => {
  assert.throws(() => {
    tw('md:tw-bibj42')
  }, /UNKNOWN_DIRECTIVE/)
})

test('already hashed rule can be negated', ({ tw }) => {
  assert.throws(() => {
    tw('-tw-bibj42')
  }, /UNKNOWN_DIRECTIVE/)
})

test('transform', ({ tw, sheet }) => {
  assert.is(tw('transform'), 'tw-dmb5fl')
  assert.equal(sheet.target, [
    '.tw-dmb5fl{--tw-1e4pbj4:0;--tw-142admc:0;--tw-9ouawy:0;--tw-wnlb2r:0;--tw-o4ir2d:0;--tw-vkgkf8:1;--tw-1lff04g:1;transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('scale', ({ tw, sheet }) => {
  assert.is(tw('scale-90'), 'tw-aytitt')
  assert.equal(sheet.target, [
    '.tw-aytitt{--tw-vkgkf8:0.9;--tw-1lff04g:0.9;transform:scale(0.9);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('bg-gradient-to-r from-purple-500', ({ tw, sheet }) => {
  assert.is(tw('bg-gradient-to-r from-purple-500'), 'tw-59jif0 tw-182i7wd')
  assert.equal(sheet.target, [
    '.tw-182i7wd{--tw-sc6ze8:#8b5cf6;--tw-wt1r4o:var(--tw-sc6ze8),var(--tw-z5bexf,rgba(139,92,246,0))}',
    '.tw-59jif0{background-image:linear-gradient(to right,var(--tw-wt1r4o))}',
  ])
})

test('different variant produce different hashes', ({ tw, sheet }) => {
  assert.is(tw('sm:text-center lg:text-center'), 'tw-1s56i2w tw-wg34pa')
  assert.equal(sheet.target, [
    '@media (min-width:640px){.tw-1s56i2w{text-align:center}}',
    '@media (min-width:1024px){.tw-wg34pa{text-align:center}}',
  ])
})

test('same style in different layers has different hash', ({ tw, sheet }) => {
  assert.is(tw`w-0 ${css({ width: '0px' })} ${apply(`w-0`)}`, 'tw-1x8w1q0 tw-1r1ybee tw-a7wz74')
  assert.equal(sheet.target, [
    // apply(`w-0`)
    '.tw-a7wz74{width:0px}',
    // w-0
    '.tw-1x8w1q0{width:0px}',
    // css({ width: '0px' })
    '.tw-1r1ybee{width:0px}',
  ])
})

test.run()
