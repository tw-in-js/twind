<script>
  import { page } from '$app/stores'
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

<pre>
  {$page.error?.stack}
</pre>

<pre>
  {JSON.stringify($page.error, null, 2)}
</pre>
