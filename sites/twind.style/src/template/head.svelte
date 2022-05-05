<script>
  import { tw } from 'twind'
  import { page } from '$app/stores'
  import { img } from '$/image'

  import favicon from '#/favicon.ico'
  import iconPNG from '#/icon.png'
  import iconSVG from '#/icon.svg'

  /** @type {string | undefined} */
  export let title = undefined

  /** @type {string | undefined} */
  export let description = undefined
</script>

<svelte:head>
  <title>{[title, 'Twind'].filter(Boolean).join(' • ')}</title>
  <meta property="og:title" content={['Twind', title].filter(Boolean).join(' • ')} />
  <meta name="twitter:title" content={['Twind', title].filter(Boolean).join(' • ')} />

  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}

  <meta property="og:url" content={`https://twind.style${$page.url.pathname}`} />
  <meta property="og:locale" content="en_US" />

  <link rel="manifest" href="/manifest.json?v=1" />
  <meta name="msapplication-config" content="/msapplication-config.xml?v=1" />
  <meta name="apple-mobile-web-app-title" content="Twind.style" />
  <meta name="application-name" content="Twind.style" />

  <meta
    property="og:image"
    content={img({
      src: iconPNG,
      width: 1200,
      height: 630,
      fit: 'pad',
      format: 'png',
    })}
  />
  <meta name="twitter:image" content={img({ src: iconPNG, width: 512, format: 'png' })} />

  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary" />

  <!--TODO: <meta name="twitter:site" content="@tw-in-js" />-->

  <link rel="external copyright" href="https://github.com/tw-in-js/twind/blob/next/LICENSE" />

  <meta
    name="theme-color"
    content={'' + tw.theme('colors.brand.1')}
    media="(prefers-color-scheme: light)"
  />
  <meta
    name="theme-color"
    content={'' + tw.theme('colors.brand.1-dark')}
    media="(prefers-color-scheme: dark)"
  />

  <link
    rel="icon"
    type="image/png"
    sizes="32x32"
    href={img({ src: iconPNG, width: 32, format: 'png' })}
  />
  <link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href={img({ src: iconPNG, width: 16, format: 'png' })}
  />
  <link rel="icon" type="image/svg+xml" href={iconSVG} />
  <link rel="icon" href={favicon} />

  <link rel="apple-touch-icon" href={img({ src: iconPNG, width: 180, format: 'png' })} />

  <link rel="preconnect" href="https://static.cloudflareinsights.com" crossOrigin="true" />
  <!-- TODO: update based on actual server used -->
  <link rel="preconnect" href="https://bh4d9od16a-dsn.algolia.net" crossOrigin="true" />
</svelte:head>
