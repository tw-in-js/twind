<script>
  import { browser } from '$app/env'
  import { page } from '$app/stores'

  import { MOD_KEY } from '$/constants'
  import Icon, { Search } from '$/icons'
  import Head from '$/template/head.svelte'
</script>

<Head
  description="The smallest, fastest, most feature complete tailwind-in-js solution in existence"
/>

<div class="text-center">
  <img class="mx-auto h-(24 md:40 lg:56)" src="/twind-logo-animated.svg" alt="Twind Logo" />

  <h1 class="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-brand-11 via-accent-11 to-info-11"
      >twind</span
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
      sveltekit:prefetch
      href={$page.stuff.docStartHref}
      class="
            text-brand-12 bg-brand-9
            hover:(bg-brand-10)
            focus:(outline-none ring-(2 brand-7 offset-(2 brand-3)))
            font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto
          "
    >
      Get started
    </a>
    <button
      type="button"
      role="search"
      class="
            bg-neutral-3 text-neutral-11
            hover:(bg-neutral-4 text-neutral-12)
            ring-(1 neutral-7 hover:neutral-8)
            focus:(outline-none ring-(2 brand-8))
            shadow-sm rounded-lg
            hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12
          "
    >
      <Icon src={Search} class="mr-3 w-4 h-4 flex-none" />
      <span class="flex-auto">Quick search...</span>
      <kbd class="font-sans font-semibold" class:hidden={!browser}>
        <abbr title="Command" class="no-underline">{MOD_KEY}</abbr>
        K
      </kbd>
    </button>
  </div>
</div>

<section class="py-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">⚡️ </span>No build step
        </dt>
        <dd class="mt-2 text-base">
          Get all the benefits of Tailwind without the need for PostCSS, configuration, purging, or
          autoprefixing.
        </dd>
      </div>

      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">🚀 </span>Framework agnostic
        </dt>
        <dd class="mt-2 text-base">
          If your app uses HTML and JavaScript, it should work with Twind. This goes for
          server-rendered apps too.
        </dd>
      </div>

      <div>
        <dt class="mt-5 text-lg leading-6 font-medium text-brand-12">
          <span aria-hidden="true">😎 </span>One low fixed cost
        </dt>
        <dd class="mt-2 text-base">
          Twind ships the compiler, not the CSS. This means unlimited styles and variants for one
          low fixed cost of ~4.5kB.
        </dd>
      </div>
    </dl>
  </div>
</section>
