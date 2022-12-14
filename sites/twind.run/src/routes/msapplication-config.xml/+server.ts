import { twind, virtual } from '@twind/core'
import config from '../../twind.config'

const tw = twind(config, virtual())

export function GET(): ReturnType<import('./$types').RequestHandler> {
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
  <browserconfig>
      <msapplication>
          <tile>
              <TileColor>${'' + tw.theme('colors.brandDark.1')}</TileColor>
              <TileImage src="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/150x150" />
              <square70x70logo src="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/70x70"/>
              <square150x150logo src="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/150x150"/>
              <square310x310logo src="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/310x310"/>
              <wide310x150logo src="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/310x150"/>
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
