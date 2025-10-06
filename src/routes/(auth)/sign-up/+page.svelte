<script lang="ts">
	import AuthCard from '@/components/auth/AuthCard.svelte';
	import { derived } from 'svelte/store';
	import { queryParameters, ssp } from 'sveltekit-search-params';

	const params = queryParameters({ redirectTo: ssp.string('/') });
	const safeRedirectTo = $derived.by(() => {
		return `/${params.redirectTo.slice(1)}`;
	});
</script>

<AuthCard
	view="SIGN_UP"
	className="my-4"
	callbackURL={safeRedirectTo}
	localization={{
		SIGN_IN: 'Sign In',
		SIGN_UP: 'Sign Up',
		SIGN_IN_DESCRIPTION: 'Please enter your credentials to sign in.',
		SIGN_UP_DESCRIPTION: 'Create a new account by filling out the form below.'
	}}
/>
