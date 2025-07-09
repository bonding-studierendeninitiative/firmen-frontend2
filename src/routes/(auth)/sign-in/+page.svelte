<script lang="ts">
	import { SignIn } from 'svelte-clerk';
	import { derived } from 'svelte/store';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import SuperDebug from 'sveltekit-superforms';

	const redirectTo = queryParam('redirectTo', ssp.string('/'));
	const safeRedirectTo = derived(redirectTo, ([value]) => {
		return `/${value.slice(1)}`;
	});
</script>

<SuperDebug data={$safeRedirectTo} />

<SignIn afterSignInUrl={$safeRedirectTo} />
