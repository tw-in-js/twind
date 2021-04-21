const isProd = process.env.NODE_ENV === 'production'

const title = 'Twind'
const description =
  'The smallest, fastest, most feature complete tailwind-in-js solution in existence'

// TODO: We need to make sure and change the URL once launched
const site = isProd ? 'https://twind.dev' : 'http://localhost:3000'

function base(path) {
  return `${site}/assets/${path}`
}

const image = base('twind-logo.png')

/**
 * HEAD
 */

// Icons provided by https://favicomatic.com/
const head = [
  ['meta', { name: 'author', content: 'Twind Team' }],
  [
    'meta',
    {
      name: 'keywords',
      content: 'twind, tailwind, tailwindcss, css-in-js, tw-in-js, tailwind-in-js',
    },
  ],
  ['link', { rel: 'icon', type: 'image/svg+xml', href: image }],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '57x57',
      href: base('apple-touch-icon-57x57.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '114x114',
      href: base('apple-touch-icon-57x57.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '72x72',
      href: base('apple-touch-icon-72x72.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '144x144',
      href: base('apple-touch-icon-144x144.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '60x60',
      href: base('apple-touch-icon-60x60.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '120x120',
      href: base('apple-touch-icon-120x120.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '76x76',
      href: base('apple-touch-icon-76x76.png'),
    },
  ],
  [
    'link',
    {
      rel: 'apple-touch-icon-precomposed',
      type: 'image/png',
      sizes: '152x152',
      href: base('apple-touch-icon-152x152.png'),
    },
  ],
  ['link', { rel: 'icon', type: 'image/png', sizes: '196x196', href: base('favicon-196x196.png') }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: base('favicon-96x96.png') }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '196x196', href: base('favicon-196x196.png') }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: base('favicon-32x32.png') }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: base('favicon-16x16.png') }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '128x128', href: base('favicon-128.png') }],
  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#3b9188' }],
  // Twitter
  ['meta', { name: 'twitter:card', content: 'summary' }],
  ['meta', { name: 'twitter:site', content: site }],
  ['meta', { name: 'twitter:title', value: title }],
  ['meta', { name: 'twitter:description', value: description }],
  ['meta', { name: 'twitter:image', content: image }],
  // Open Graph
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'en_US' }],
  ['meta', { property: 'og:site', content: site }],
  ['meta', { property: 'og:site_name', content: title }],
  ['meta', { property: 'og:title', content: title }],
  ['meta', { property: 'og:image', content: image }],
  ['meta', { property: 'og:description', content: description }],
  // MS
  ['meta', { name: 'msapplication-TileColor', content: '#3b9188' }],
  ['meta', { name: 'msapplication-TileImage', content: base('mstile-144x144.png') }],
  ['meta', { name: 'msapplication-square70x70logo', content: base('mstile-70x70.png') }],
  ['meta', { name: 'msapplication-square150x150logo', content: base('mstile-150x150.png') }],
  ['meta', { name: 'msapplication-wide310x150logo', content: base('mstile-310x150.png') }],
  ['meta', { name: 'msapplication-square310x310logo', content: base('mstile-310x310.png') }],
]

/**
 * SIDEBARS
 */

const guideSidebar = [
  {
    text: 'Handbook',
    children: [
      { text: 'Introduction', link: '/handbook/introduction' },
      { text: 'Getting Started', link: '/handbook/getting-started' },
      { text: 'The Shim', link: '/handbook/the-shim' },
      { text: 'Styling with Twind', link: '/handbook/styling-with-twind' },
      { text: 'Grouping Syntax', link: '/handbook/grouping-syntax' },
      { text: 'CSS in Twind', link: '/handbook/css-in-twind' },
      { text: 'Overwriting Styles', link: '/handbook/overwriting-styles' },
      {
        text: 'Extended Functionality',
        link: '/handbook/extended-functionality',
      },
      { text: 'Plugins', link: '/handbook/plugins' },
      // TODO: Move this content possibly into React usage guides
      // { text: 'Authoring Components', link: '/handbook/authoring-components' },
      { text: 'Configuration', link: '/handbook/configuration' },

      { text: 'Quick Reference', link: '/handbook/quick-reference' },
      {
        text: 'FAQ',
        link: '/handbook/faq',
      },
    ],
  },
  {
    text: 'Migration Guides',
    children: [
      {
        text: 'Tailwind',
        link: '/migration-guides/tailwind',
      },
      {
        text: 'twin.macro',
        link: '/migration-guides/twinmacro',
      },
    ],
  },
  {
    text: 'Usage Guides',
    children: [
      { text: 'SSR', link: '/usage-guides/ssr' },
      { text: 'React', link: '/usage-guides/react' },
      { text: 'NextJS', link: '/usage-guides/nextjs' },
      { text: 'Gatsby', link: '/usage-guides/gatsby' },
      { text: 'Preact', link: '/usage-guides/preact' },
      { text: ' WMR', link: '/usage-guides/wmr' },
      { text: ' Vue', link: '/usage-guides/vue' },
      { text: 'Svelte', link: '/usage-guides/svelte' },
      {
        text: 'Lit Element',
        link: '/usage-guides/lit-element',
      },
      {
        text: ' Web Components',
        link: '/usage-guides/web-components',
      },
      {
        text: 'Typescript',
        link: '/usage-guides/typescript',
      },
    ],
  },
]

const apiSidebar = [
  {
    text: 'API',
    children: [
      // { text: "Modules Overview", link: "/api" },
      { text: 'twind', link: '/api/modules/twind.html' },
      { text: 'twind/colors', link: '/api/modules/twind_colors.html' },
      { text: 'twind/css', link: '/api/modules/twind_css.html' },
      { text: 'twind/observe', link: '/api/modules/twind_observe.html' },
      { text: 'twind/server', link: '/api/modules/twind_server.html' },
      { text: 'twind/sheets', link: '/api/modules/twind_sheets.html' },
      { text: 'twind/shim', link: '/api/modules/twind_shim.html' },
      { text: 'twind/shim/server', link: '/api/modules/twind_shim_server.html' },
      { text: 'twind/style', link: '/api/modules/twind_style.html' },
    ],
  },
]

module.exports = {
  title,
  description,
  head,
  docsDir: '.',
  lang: 'en-US',
  themeConfig: {
    algolia: {
      apiKey: '2755c9a0c60b75484bbc33bf9f6fe505',
      indexName: 'twind',
    },
    nav: [
      { text: 'Guide', link: '/handbook/introduction' },
      { text: 'API', link: '/api/README.html' },
      { text: 'GitHub', link: 'https://github.com/tw-in-js/twind' },
      { text: 'Discord', link: 'https://discord.com/invite/2aP5NkszvD' },
    ],
    sidebar: {
      '/handbook/': guideSidebar,
      '/usage-guides/': guideSidebar,
      '/migration-guides/': guideSidebar,
      '/api/': apiSidebar,
    },
  },
}
