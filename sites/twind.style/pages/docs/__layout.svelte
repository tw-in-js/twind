<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ url, fetch }) {
    const [nav, meta] = await Promise.all([
      fetch(`/docs/$nav.json`).then((res) => res.json()),
      fetch(`${url.pathname}.json`).then((res) => res.json()),
    ])

    if (!meta) {
      return {
        status: 404,
        error: new Error('Page could not be found'),
      }
    }
    return { props: { nav, meta }, stuff: { nav, editPath: meta.editPath } }
  }
</script>

<script>
  import { page } from '$app/stores'
  import { scrollspy } from '$/actions'
  import Head from '$/template/head.svelte'

  /** @type {import('./[pages].json').Nav} */
  export let nav

  /** @type {import('./[...slug].json').Page} */
  export let meta

  $: href = $page.url.pathname

  $: ({ section, prev, next } = nav.pages[href])
</script>

<Head title={meta.title} description={meta.excerpt} />

<header>
  {#if section}
    <p class="mb-2 text-sm leading-6 font-semibold text-accent-11">{section}</p>
  {/if}
  <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-12 tracking-tight">
    {meta.title}
  </h1>
  {#if meta.excerpt}
    <p class="mt-2 text-lg text-brand-11">{meta.excerpt}</p>
  {/if}
</header>

<div
  class="mt-4 lg:mt-8 prose max-w-none prose-headings:scroll-mt-24"
  use:scrollspy={{ className: 'text-accent-11' }}
>
  <slot />
</div>

{#if prev || next}
  <footer class="text-sm leading-6 mt-12 font-semibold flex items-center text-brand-11">
    {#if prev}
      <a href={prev} class="hover:text-brand-12" rel="prev" sveltekit:prefetch>
        <span class="inline-block mr-2" aria-hidden="true"> ‹ </span>
        {nav.pages[prev].label}
      </a>
    {/if}
    {#if next}
      <a href={next} class="ml-auto hover:text-brand-12" rel="next" sveltekit:prefetch>
        {nav.pages[next].label}
        <span class="inline-block ml-2" aria-hidden="true"> › </span>
      </a>
    {/if}
  </footer>
{/if}
