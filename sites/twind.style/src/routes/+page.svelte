<script>
  import { browser } from '$app/environment'
  import { page } from '$app/stores'

  import { shortcut } from '$lib/actions'
  import { MOD_KEY } from '$lib/constants'
  import Icon, { MagnifyingGlassSolid } from '$lib/icons'
  import { searchOpen } from '$lib/stores'
  import Head from '$lib/template/head.svelte'

  /** @type {import('./$types').PageData} */
  export let data
</script>

<Head />

<div class="text-center">
  <img class="mx-auto h-(24 md:40 lg:56)" src="/twind-logo-animated.svg" alt="Twind Logo" />

  <h1 class="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-brand-11 via-accent-11 to-info-11"
      >Twind</span
    ><span
      class="bg-clip-text text-transparent bg-gradient-to-r from-info-11 via-accent-11 to-brand-11"
      >.style</span
    >
  </h1>
  <p
    class="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-accent-11"
  >
    The smallest, fastest, most feature complete tailwind-in-js solution in existence
  </p>
  <div class="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
    <a
      data-sveltekit-prefetch
      href={$page.data.docStartHref}
      class="
        bg-accent-4 text-accent-12
        hover:bg-accent-5
        focus:(outline-none bg-accent-6 ring-(2 accent-7 offset-(2 brand-1)))
        shadow-sm rounded-lg
        font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-48
      "
    >
      Get started
    </a>
    <button
      type="button"
      class="
        bg-brand-4 text-brand-11
        hover:(bg-brand-5 text-brand-12)
        focus:(bg-brand-6 text-brand-12 outline-none ring-(2 brand-7 offset-(2 brand-1)))
        shadow-sm rounded-lg
        hidden sm:flex items-center justify-start w-72 text-left space-x-3 px-4 h-12
      "
      on:click={() => ($searchOpen = true)}
      use:shortcut={{ control: true, code: 'KeyK' }}
    >
      <Icon src={MagnifyingGlassSolid} class="mr-3 w-4 h-4 flex-none" />
      <span class="flex-auto">Quick search...</span>
      <span class="ml-auto font-sans font-semibold" class:hidden={!browser}>
        <kbd title="Command">{MOD_KEY}</kbd>
        <kbd>K</kbd>
      </span>
    </button>
  </div>
</div>

<section class="py-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">⚡️&nbsp;</span>No build step
        </dt>
        <dd class="mt-2 text-base">
          Get all the benefits of Tailwind without the need for PostCSS, configuration, purging, or
          autoprefixing.
        </dd>
      </div>

      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">🚀&nbsp;</span>Framework agnostic
        </dt>
        <dd class="mt-2 text-base">
          If your app uses HTML and JavaScript, it should work with Twind. This goes for
          server-rendered apps too.
        </dd>
      </div>

      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">😎&nbsp;</span>One low fixed cost
        </dt>
        <dd class="mt-2 text-base">
          Twind ships the compiler, not the CSS. This means unlimited styles and variants for one
          low fixed cost.
        </dd>
      </div>
    </dl>
  </div>
</section>

<section
  class="mt-4 lg:mt-8 prose prose-headings:scroll-mt-24 &>nav:hidden max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 overflow-hidden lg:overflow-visible"
>
  {@html data.content}
</section>
