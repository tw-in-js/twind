const isProd = process.env.NODE_ENV === 'production'

const title = 'Twind'
const description =
  'The smallest, fastest, most feature complete tailwind-in-js solution in existence'

// TODO: We need to make sure and change the URL once launched
const site = isProd ? 'https://twind-dev.netlify.app' : 'http://localhost:3000'

function base(url) {
  return `${site}/assets/${url}`
}

const image = base('twind-logo.png')

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

const guideSidebar = [
  {
    text: 'Handbook',
    children: [
      { text: 'Introduction', link: '/handbook/' },
      { text: 'Installation', link: '/handbook/installation' },

      { text: 'Styling with Twind', link: '/handbook/styling-with-twind' },
      { text: 'Configuration and Theming', link: '/handbook/configuration' },
      { text: 'Grouping Syntax', link: '/handbook/grouping-syntax' },
      { text: 'CSS in Twind', link: '/handbook/css-in-twind' },
      { text: 'Global Styles', link: '/handbook/global-styles' },
      { text: 'Overwriting Styles', link: '/handbook/overwriting-styles' },
      { text: 'The Shim', link: '/handbook/the-shim' },
      {
        text: 'Improving Performance',
        link: '/handbook/improving-performance',
      },
      {
        text: 'Extended Functionality',
        link: '/handbook/extended-functionality',
      },
      { text: 'Plugins', link: '/handbook/plugins' },
      { text: 'Authoring Components', link: '/handbook/authoring-components' },
      {
        text: 'Beyond Tailwind',
        link: '/handbook/beyond-tailwind',
      },
      {
        text: 'Frequently Asked Questions',
        link: '/handbook/frequently-asked-questions',
      },
      { text: 'Quick Reference', link: '/handbook/quick-reference' },
      { text: 'Browser Support', link: '/handbook/browser-support' },
      { text: 'Release Notes', link: '/handbook/release-notes' },
      { text: 'Contributing', link: '/handbook/contributing' },
    ],
  },
  {
    text: 'Migration Guides',
    children: [
      {
        text: 'Migrate from Tailwind',
        link: '/migration-guides/migrate-from-tailwind',
      },
      {
        text: 'Migrate from twin.macro',
        link: '/migration-guides/migrate-from-twinmacro',
      },
    ],
  },
  {
    text: 'Usage Guides',
    children: [
      { text: 'Use with Gatsby', link: '/usage-guides/use-with-gatsby' },
      {
        text: 'Use with Lit Element',
        link: '/usage-guides/use-with-lit-element',
      },
      { text: 'Use with NextJS', link: '/usage-guides/use-with-nextjs' },
      { text: 'Use with Preact', link: '/usage-guides/use-with-preact' },
      { text: 'Use with React', link: '/usage-guides/use-with-react' },
      { text: 'Use with SSR', link: '/usage-guides/use-with-ssr' },
      { text: 'Use with Svelte', link: '/usage-guides/use-with-svelte' },
      {
        text: 'Use with Typescript',
        link: '/usage-guides/use-with-typescript',
      },
      { text: 'Use with Vue', link: '/usage-guides/use-with-vue' },
      {
        text: 'Use with Web Components',
        link: '/handbook/use-with-web-components',
      },
      { text: 'Use with WMR', link: '/handbook/use-with-wmr' },
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
      apiKey: 'your_api_key',
      indexName: 'index_name',
    },
    nav: [
      { text: 'Handbook', link: '/handbook/' },
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
