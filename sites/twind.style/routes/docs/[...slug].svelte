<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ params, fetch }) {
    /** @type {import('./[...slug].json').Body}*/
    const page = await fetch(`/docs/${params.slug}.json`).then((res) => res.json())

    return { props: { page }, stuff: { file: page.file } }
  }
</script>

<script>
  import { tw } from 'twind'
  import { scrollspy, wicked, lazy } from '$/actions'
  import Head from '$/template/head.svelte'

  /** @type {import('./[...slug].json').Body}*/
  export let page
</script>

<Head title={page.title} description={page.excerpt} />

<header>
  {#if page.section}
    <p class="mb-2 text-sm leading-6 font-semibold text-accent-11">{page.section}</p>
  {/if}
  <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-12 tracking-tight">
    {page.title}
  </h1>
  {#if page.excerpt}
    <p class="mt-2 text-lg text-brand-11">{page.excerpt}</p>
  {/if}
</header>

<div
  class="mt-4 lg:mt-8 prose max-w-none prose-headings:scroll-mt-24"
  use:scrollspy={{ className: tw('text-accent-11') }}
  use:wicked={[['[data-clipboard-copy]', lazy(() => import('$/actions/clipboard-copy'))]]}
>
  {@html page.content}
</div>

{#if page.prev || page.next}
  <footer class="text-sm leading-6 mt-12 font-semibold flex items-center text-brand-11">
    <!-- TODO: add dimmed "PREVIOUS" -->
    {#if page.prev}
      <a href={page.prev.href} class="hover:text-brand-12" rel="prev" sveltekit:prefetch>
        <span class="inline-block mr-2" aria-hidden="true">‹</span>
        {page.prev.label}
      </a>
    {/if}
    {#if page.next}
      <!-- TODO: add dimmed "NEXT" -->
      <a href={page.next.href} class="ml-auto hover:text-brand-12" rel="next" sveltekit:prefetch>
        {page.next.label}
        <span class="inline-block ml-2" aria-hidden="true">›</span>
      </a>
    {/if}
  </footer>
{/if}
