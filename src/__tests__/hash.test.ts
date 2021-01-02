import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import type { Instance } from '../types'
import type { VirtualSheet } from '../sheets/index'

import { virtualSheet } from '../sheets/index'

import { create, strict } from '../index'

const test = suite<{
  sheet: VirtualSheet
  instance: Instance
}>('hash')

test.before((context) => {
  context.sheet = virtualSheet()
  context.instance = create({
    sheet: context.sheet,
    mode: strict,
    preflight: false,
    hash: true,
    prefix: false,
    theme: { extend: { colors: { primary: '#0d3880', '#0d3880': '#0d3880' } } },
  })
})

test.after.each(({ sheet }) => {
  sheet.reset()
})

test('class names are hashed', ({ instance, sheet }) => {
  assert.is(instance.tw('group flex pt-4 text-center'), 'tw-1bk5mm5 tw-1sv1rgs tw-ocaj78 tw-5693iz')
  assert.equal(sheet.target, [
    '.tw-1sv1rgs{display:flex}',
    '.tw-ocaj78{padding-top:1rem}',
    '.tw-5693iz{text-align:center}',
  ])
})

test('keyframes are hashed', ({ instance, sheet }) => {
  assert.is(instance.tw('animate-pulse'), 'tw-15o2im6')
  assert.equal(sheet.target, [
    '@keyframes tw-sktrkv{0%,100%{opacity:1}50%{opacity:.5}}',
    '.tw-15o2im6{animation:tw-sktrkv 2s cubic-bezier(0.4, 0, 0.6, 1) infinite}',
  ])
})

test('same declarations are inserted only once', ({ instance, sheet }) => {
  assert.is(instance.tw('border-x border-lr'), 'tw-1kfasqk tw-1kfasqk')
  assert.equal(sheet.target, ['.tw-1kfasqk{border-left-width:1px;border-right-width:1px}'])
})

test('accept already hashed rules', ({ instance, sheet }) => {
  assert.is(instance.tw('tw-1bk5mm5 tw-1sv1rgs'), 'tw-1bk5mm5 tw-1sv1rgs')
  assert.equal(sheet.target, [])
})

test('already hashed rule can not have variants', ({ instance }) => {
  assert.throws(() => {
    instance.tw('md:tw-1sv1rgs')
  }, /UNKNOWN_DIRECTIVE/)
})

test('already hashed rule can be negated', ({ instance }) => {
  assert.throws(() => {
    instance.tw('-tw-1sv1rgs')
  }, /UNKNOWN_DIRECTIVE/)
})

test('same color is inserted only once', ({ instance, sheet }) => {
  assert.is(instance.tw('text-primary text-#0d3880'), 'tw-1hgnj9x tw-1hgnj9x')
  assert.equal(sheet.target, [
    '.tw-1hgnj9x{--tw-dxr4o8:1;color:#0d3880;color:rgba(13,56,128,var(--tw-dxr4o8))}',
  ])
})

test('transform', ({ instance, sheet }) => {
  assert.is(instance.tw('transform'), 'tw-1ojy65l')
  assert.equal(sheet.target, [
    '.tw-1ojy65l{--tw-1e4pbj4:0;--tw-142admc:0;--tw-9ouawy:0;--tw-wnlb2r:0;--tw-o4ir2d:0;--tw-vkgkf8:1;--tw-1lff04g:1;transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('scale', ({ instance, sheet }) => {
  assert.is(instance.tw('scale-90'), 'tw-m8swvl')
  assert.equal(sheet.target, [
    '.tw-m8swvl{--tw-vkgkf8:0.9;--tw-1lff04g:0.9;transform:scale(0.9);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('bg-gradient-to-r from-purple-500', ({ instance, sheet }) => {
  assert.is(instance.tw('bg-gradient-to-r from-purple-500'), 'tw-kvlmqb tw-1unz9xc')
  assert.equal(sheet.target, [
    '.tw-kvlmqb{background-image:linear-gradient(to right,var(--tw-wt1r4o,var(--tw-sc6ze8,transparent),var(--tw-z5bexf,transparent)))}',
    '.tw-1unz9xc{--tw-sc6ze8:#8b5cf6}',
  ])
})

test('different variant produce different hashes', ({ instance, sheet }) => {
  assert.is(instance.tw('sm:text-center lg:text-center'), 'tw-zqeog8 tw-ymouy7')
  assert.equal(sheet.target, [
    '@media (min-width: 640px){.tw-zqeog8{text-align:center}}',
    '@media (min-width: 1024px){.tw-ymouy7{text-align:center}}',
  ])
})

test.run()
