<script>
  import { draw } from 'svelte/transition'

  /**
   * @type {import('./types').IconSource}
   */
  export let src = {}

  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   *
   * @type {string | undefined}
   */
  export let label = undefined

  /**
   * @type {string | undefined}
   */
  export let title = undefined

  /**
   * @type {string | undefined}
   */
  export let description = undefined

  /**
   * @type {import('svelte/transition').DrawParams | boolean | undefined}
   */
  let drawParams = undefined

  /**
   * @type {string | undefined}
   */
  let className = undefined
  export { drawParams as draw, className as class }
</script>

<svg
  class={className}
  focusable="false"
  aria-hidden={!!label || !(title || description)}
  role="img"
  viewBox={src.viewbox}
  fill={src.fill || (src.stroke ? 'none' : 'currentColor')}
  stroke={src.stroke || (src.fill ? 'none' : 'currentColor')}
  {...$$restProps}
  xmlns="http://www.w3.org/2000/svg"
>
  {#if title}
    <title>{title}</title>
  {/if}
  {#if description}
    <desc>{description}</desc>
  {/if}

  {#each                                         src.circles || [] as circle}
    <circle {...circle} />
  {/each}

  {#each                                         src.paths || [] as path}
    {#if drawParams}
      <path {...path} in:draw={drawParams === true ? {} : drawParams} />
    {:else}
      <path {...path} />
    {/if}
  {/each}

  {#each                                         src.polygons || [] as polygon}
    <polygon {...polygon} />
  {/each}

  {#each                                         src.rects || [] as rect}
    <rect {...rect} />
  {/each}

  {#each                                         src.lines || [] as line}
    <line {...line} />
  {/each}
</svg>

{#if label}
  <span class="sr-only">{label}</span>
{/if}
