import { img } from '$lib/image'
import iconPNG from '$lib/assets/icon.png'

import { twind, virtual } from 'twind'
import config from '../../twind.config'

const tw = twind(config, virtual())

export function GET(): ReturnType<import('./$types').RequestHandler> {
  return new Response(
    JSON.stringify({
      // "$schema": "https://json.schemastore.org/web-manifest-combined.json",
      name: 'Twind.run',
      short_name: 'Twind',
      description: `An advanced online playground for Twind that lets you use all of Twind's build-time features directly in the browser.`,
      theme_color: '' + tw.theme('colors.brand.1-dark'),
      background_color: '' + tw.theme('colors.brand.1-dark'),
      display: 'standalone',
      scope: '/',
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
    {
      headers: {
        'content-type': 'application/manifest+json; charset=utf-8',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
  )
}
