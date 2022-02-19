import type { EndpointOutput } from '@sveltejs/kit'

import { startHref } from './docs/[pages].json'
import { img } from '$/image'
import iconPNG from '#/icon.png'

import { twind, virtual } from 'twind'
import config from '$/twind.config'
const tw = twind(config, virtual())

export function get(): EndpointOutput {
  return {
    headers: {
      'content-type': 'application/manifest+json; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
    body: JSON.stringify({
      // "$schema": "https://json.schemastore.org/web-manifest-combined.json",
      name: 'Twind.style',
      short_name: 'Twind',
      description:
        'The smallest, fastest, most feature complete tailwind-in-js solution in existence',
      theme_color: '' + tw.theme('colors.brand.1-dark'),
      background_color: '' + tw.theme('colors.brand.1-dark'),
      display: 'standalone',
      scope: '/',
      start_url: startHref,
      icons: [
        {
          src: img({ src: iconPNG, width: 196, format: 'png' }),
          sizes: '196x196',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: img({ src: iconPNG, width: 512, format: 'png' }),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    }),
  }
}
