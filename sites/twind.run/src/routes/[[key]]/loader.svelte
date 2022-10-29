<script>
  import { cx } from '$lib/twind'

  /** Class name for the editor container */
  let className = ''
  export { className as class }

  /** @type {unknown} */
  export let isReady = false
</script>

<div
  class={cx(
    '~(relative,flex-auto,flex,justify-center,content-center,bg-brand-2,[text-align:initial])',
    className,
  )}
>
  {#if !isReady}
    <slot name="loading">
      <div class="flex place-items-center text-neutral-11">
        <span class="animate-pulse">Loading ...</span>
      </div>
    </slot>
  {/if}

  <slot />
</div>
