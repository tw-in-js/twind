<script>
  import { page } from '$app/stores'
  import { cx } from 'twind'
</script>

<footer
  class={cx(
    'mt-10 py-10 text-sm',
    $page.stuff.file ? 'border-t border-brand-7 flex items-center' : 'text-center',
  )}
>
  <a
    href="https://github.com/tw-in-js/twind/blob/next/LICENSE"
    rel="external noopener noreferrer license"
    target="_blank"
    class="ml-1 hover:text-brand-12"
  >
    MIT Licensed
  </a>

  <span class="ml-1">© {new Date().getFullYear()}</span>
  <a
    href="https://github.com/tw-in-js/twind/graphs/contributors"
    rel="external noopener noreferrer nofollow author copyright"
    target="_blank"
    class="ml-1 hover:text-brand-12"
  >
    Twind
  </a>

  {#if $page.stuff.file}
    <a
      href={`https://github.com/tw-in-js/twind/edit/next/${$page.stuff.file}`}
      rel="external noopener noreferrer nofollow"
      target="_blank"
      class="ml-auto hover:text-brand-12"
    >
      Edit this page on GitHub
    </a>
  {/if}
</footer>
