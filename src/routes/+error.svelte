<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="text-5xl">{$page.status}</h1>
<h1 class="text-3xl">{$page.error?.message}</h1>
{#if $page.status >= 500}
	<p>Error ID: {$page.error?.id}</p>
	<h1>Please, report us the error</h1>
{/if}
