<script>
  import { page } from '$app/stores'
  import { cx } from '$lib/twind'
</script>

<footer
  class={cx(
    'mt-10 py-10 text-sm flex items-center',
    $page.data.file ? 'border-t border-brand-7 justify-between gap-4' : 'justify-center gap-8',
  )}
>
  <div class="flex place-content-center gap-1">
    <a
      href="https://github.com/tw-in-js/twind/blob/next/LICENSE"
      rel="external noopener noreferrer license"
      class="hover:text-brand-12"
    >
      MIT Licensed
    </a>

    <span class="ml-1">© {new Date().getFullYear()}</span>
    <a
      href="https://github.com/tw-in-js/twind/graphs/contributors"
      rel="external noopener noreferrer nofollow author copyright"
      class="hover:text-brand-12"
    >
      Twind
    </a>
  </div>

  {#if $page.data.file && $page.data.editLink !== false}
    <a
      href={`https://github.com/tw-in-js/twind/edit/next/${$page.data.file}`}
      rel="external noopener noreferrer nofollow"
      target="_blank"
      class="hover:text-brand-12"
    >
      Edit this page on GitHub
    </a>
  {/if}
</footer>
