import { img } from '$lib/image'
import iconPNG from '$lib/assets/icon.png'

import { twind, virtual } from 'twind'
import config from '../../twind.config'

const tw = twind(config, virtual())

export function GET(): ReturnType<import('./$types').RequestHandler> {
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
  <browserconfig>
      <msapplication>
          <tile>
              <TileColor>${'' + tw.theme('colors.brand.1-dark')}</TileColor>
              <TileImage src="${img({ src: iconPNG, width: 150, format: 'png' })}" />
              <square70x70logo src="${img({ src: iconPNG, width: 70, format: 'png' })}"/>
              <square150x150logo src="${img({ src: iconPNG, width: 150, format: 'png' })}"/>
              <square310x310logo src="${img({ src: iconPNG, width: 310, format: 'png' })}"/>
              <wide310x150logo src="${img({
                src: iconPNG,
                width: 310,
                height: 150,
                fit: 'pad',
                format: 'png',
              })}"/>
          </tile>
      </msapplication>
  </browserconfig>`,
    {
      headers: {
        'content-type': 'text/xml; charset=utf-8',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
  )
}
