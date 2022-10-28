<script>
  import { tw } from '$lib/twind'
  import { scrollspy, wicked, lazy } from '$lib/actions'
  import Head from '$lib/template/head.svelte'

  /** @type {import('./$types').PageData}*/
  export let data
</script>

<Head title={data.title} description={data.excerpt} />

<header>
  {#if data.section}
    <p class="mb-2 text-sm leading-6 font-semibold text-accent-11">{data.section}</p>
  {/if}
  <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-12 tracking-tight">
    {data.title}
  </h1>
  {#if data.excerpt}
    <p class="mt-2 text-lg text-brand-11">{data.excerpt}</p>
  {/if}
</header>

<div
  class="mt-4 lg:mt-8 prose max-w-none prose-headings:scroll-mt-24"
  use:scrollspy={{ className: tw('text-accent-11') }}
  use:wicked={[['[data-clipboard-copy]', lazy(() => import('$lib/actions/clipboard-copy'))]]}
>
  {@html data.content}
</div>

{#if data.prev || data.next}
  <footer class="text-sm leading-6 mt-12 font-semibold flex items-center text-brand-11">
    <!-- TODO: add dimmed "PREVIOUS" -->
    {#if data.prev}
      <a href={data.prev.href} class="hover:text-brand-12" rel="prev" data-sveltekit-prefetch>
        <span class="inline-block mr-2" aria-hidden="true">‹</span>
        {data.prev.label}
      </a>
    {/if}
    {#if data.next}
      <!-- TODO: add dimmed "NEXT" -->
      <a
        href={data.next.href}
        class="ml-auto hover:text-brand-12"
        rel="next"
        data-sveltekit-prefetch
      >
        {data.next.label}
        <span class="inline-block ml-2" aria-hidden="true">›</span>
      </a>
    {/if}
  </footer>
{/if}
