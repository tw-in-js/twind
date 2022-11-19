<script>
  import { tw } from '@twind/core'
  import { page } from '$app/stores'

  import favicon from '$lib/assets/favicon.ico'
  import iconSVG from '$lib/assets/icon.svg'

  /** @type {string | undefined} */
  export let title = undefined

  /** @type {string | undefined} */
  export let description = `An advanced online playground for Twind that lets you use all of Twind's features directly in the browser.`
</script>

<svelte:head>
  <title>{[title, 'Twind.run'].filter(Boolean).join(' • ')}</title>
  <meta property="og:title" content={['Twind.run', title].filter(Boolean).join(' • ')} />
  <meta name="twitter:title" content={['Twind.run', title].filter(Boolean).join(' • ')} />

  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}

  <meta property="og:url" content={`https://twind.run${$page.url.pathname}`} />
  <meta property="og:locale" content="en_US" />

  <link rel="manifest" href="/manifest.json?v=1" />
  <meta name="msapplication-config" content="/msapplication-config.xml?v=1" />
  <meta name="apple-mobile-web-app-title" content="Twind.run" />
  <meta name="application-name" content="Twind.run" />

  <meta
    property="og:image"
    content="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/1200x630"
  />
  <meta
    name="twitter:image"
    content="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/512x512"
  />

  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary" />

  <!--TODO: <meta name="twitter:site" content="@tw-in-js" />-->

  <link rel="external copyright" href="https://github.com/tw-in-js/twind/blob/main/LICENSE" />

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
    href="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/32x32"
  />
  <link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/16x16"
  />
  <link rel="icon" type="image/svg+xml" href={iconSVG} />
  <link rel="icon" href={favicon} />

  <link
    rel="apple-touch-icon"
    href="https://imagedelivery.net/clgAS5HJ8HoJM1G5J8tcLA/ad127ccc-64a5-4460-d429-39ba2ab6ea00/180x180"
  />

  <link rel="preconnect" href="https://cdn.skypack.dev" crossorigin="anonymous" />

  <slot />
</svelte:head>
