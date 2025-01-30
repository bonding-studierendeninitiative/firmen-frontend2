<script lang="ts">
	import { page } from '$app/stores';
	import SuperDebug from 'sveltekit-superforms';
</script>

<section>
	<h1>The billing address templates could not be loaded</h1>
	<p>{$page.error?.message}</p>
	<SuperDebug data={$page.error} />
</section>