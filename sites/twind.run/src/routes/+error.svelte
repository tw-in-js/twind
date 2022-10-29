<script>
  import { page } from '$app/stores'
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

{#if $page.error?.frame}
  <pre>
  {$page.error.frame}
</pre>
{/if}

{#if $page.error?.stack}
  <pre>
  {$page.error.stack}
</pre>
{/if}

<pre>
  {JSON.stringify($page.error, null, 2)}
</pre>
