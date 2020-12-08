import type { Instance, Injector } from '@tw-in-js/types'

import { virtualInjector, strict } from '..'
import { create } from '../instance'

let injector: Injector<string[]>
let instance: Instance

beforeEach(() => {
  injector = virtualInjector()
  instance = create({
    injector,
    mode: strict,
    preflight: false,
    hash: true,
    prefix: false,
    theme: { extend: { colors: { primary: '#0d3880', '#0d3880': '#0d3880' } } },
  })
})

test('class names are hashed', () => {
  expect(instance.tw('group flex pt-4 text-center')).toBe(
    'tw-1bk5mm5 tw-1sv1rgs tw-ocaj78 tw-5693iz',
  )
  expect(injector.target).toStrictEqual([
    '.tw-1sv1rgs{display:flex}',
    '.tw-ocaj78{padding-top:1rem}',
    '.tw-5693iz{text-align:center}',
  ])
})

test('keyframes are hashed', () => {
  expect(instance.tw('animate-pulse')).toBe('tw-15o2im6')
  expect(injector.target).toStrictEqual([
    '.tw-15o2im6{animation:tw-sktrkv 2s cubic-bezier(0.4, 0, 0.6, 1) infinite}',
    '@keyframes tw-sktrkv{0%,100%{opacity:1}50%{opacity:.5}}',
  ])
})

test('same declarations are inserted only once', () => {
  expect(instance.tw('border-x border-lr')).toBe('tw-1kfasqk tw-1kfasqk')
  expect(injector.target).toStrictEqual([
    '.tw-1kfasqk{border-left-width:1px;border-right-width:1px}',
  ])
})

test('same color is inserted only once', () => {
  expect(instance.tw('text-primary text-#0d3880')).toBe('tw-1hgnj9x tw-1hgnj9x')
  expect(injector.target).toStrictEqual([
    '.tw-1hgnj9x{--tw-dxr4o8:1;color:#0d3880;color:rgba(13,56,128,var(--tw-dxr4o8))}',
  ])
})

test('transform', () => {
  expect(instance.tw('transform')).toBe('tw-1ojy65l')
  expect(injector.target).toStrictEqual([
    '.tw-1ojy65l{--tw-1e4pbj4:0;--tw-142admc:0;--tw-9ouawy:0;--tw-wnlb2r:0;--tw-o4ir2d:0;--tw-vkgkf8:1;--tw-1lff04g:1;transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('scale', () => {
  expect(instance.tw('scale-90')).toBe('tw-m8swvl')
  expect(injector.target).toStrictEqual([
    '.tw-m8swvl{--tw-vkgkf8:0.9;--tw-1lff04g:0.9;transform:scale(0.9);transform:translateX(var(--tw-1e4pbj4,0)) translateY(var(--tw-142admc,0)) rotate(var(--tw-9ouawy,0)) skewX(var(--tw-wnlb2r,0)) skewY(var(--tw-o4ir2d,0)) scaleX(var(--tw-vkgkf8,1)) scaleY(var(--tw-1lff04g,1))}',
  ])
})

test('bg-gradient-to-r from-purple-500', () => {
  expect(instance.tw('bg-gradient-to-r from-purple-500')).toBe('tw-8lrugz tw-1unz9xc')
  expect(injector.target).toStrictEqual([
    '.tw-1unz9xc{--tw-sc6ze8:#8b5cf6}',
    '.tw-8lrugz{background-image:linear-gradient(to right,var(--tw-wt1r4o,var(--tw-sc6ze8,transparent),var(--tw-1h61fts,transparent)))}',
  ])
})

test('different variant produce different hashes', () => {
  expect(instance.tw('sm:text-center lg:text-center')).toBe('tw-zqeog8 tw-ymouy7')
  expect(injector.target).toStrictEqual([
    '@media (min-width: 640px){.tw-zqeog8{text-align:center}}',
    '@media (min-width: 1024px){.tw-ymouy7{text-align:center}}',
  ])
})
