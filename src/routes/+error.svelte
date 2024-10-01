<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>Error (Root) {$page.error?.message} {JSON.stringify($page.error)}</h1>
