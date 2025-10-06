<script lang="ts">
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { Checkbox } from '../ui/checkbox';
	import authClient from '@/auth-client';
	import { Github } from '@lucide/svelte';
	import { PUBLIC_APP_URL } from '$env/static/public';

	interface Props {
		className?: string;
		classNames?: any;
		localization?: any;
		redirectTo?: string;
		isSubmitting?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		redirectTo = '',
		isSubmitting = false
	}: Props = $props();

	let email = $state('');
	let rememberMe = $state(false);
	let error: string | null = $state(null);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = null;
		if (!email) {
			error = localization?.FIELDS_REQUIRED ?? 'Email is required';
			return;
		}

		if (email.includes('@bonding.de')) {
			const res = await authClient.signIn.sso({
				email,
				providerId: 'entra',
				callbackURL: `${PUBLIC_APP_URL}/dashboard`
			});
		} else {
			const res = await authClient.signIn.magicLink({
				email,
				callbackURL: `${PUBLIC_APP_URL}/dashboard`
			});
		}
	}
</script>

<form onsubmit={handleSubmit} class={`grid w-full gap-6 ${className} ${classNames?.base ?? ''}`}>
	{#if error}
		<div class="text-red-500 text-sm">{error}</div>
	{/if}

	<!-- Email/Username input -->
	<div class="grid gap-2">
		<Label for="email">{localization?.EMAIL ?? 'Email'}</Label>
		<Input
			id="email"
			type="email"
			required
			name="email"
			bind:value={email}
			placeholder={localization?.EMAIL_PLACEHOLDER ?? 'Enter your email'}
			disabled={isSubmitting}
			class={classNames?.input ?? ''}
		/>
	</div>

	<!-- Remember me checkbox -->
	<div class="flex items-center space-x-2">
		<Checkbox id="remember" bind:checked={rememberMe} disabled={isSubmitting} />
		<Label for="remember" class="text-sm">{localization?.REMEMBER_ME ?? 'Remember me'}</Label>
	</div>

	<!-- Submit button -->
	<Button type="submit" disabled={isSubmitting} class={`w-full ${classNames?.button ?? ''}`}>
		{isSubmitting
			? (localization?.SIGNING_IN ?? 'Signing in...')
			: (localization?.SIGN_IN_ACTION ?? 'Sign in')}
	</Button>

	<Button
		type="button"
		variant="secondary"
		class={`w-full ${classNames?.button ?? ''}`}
		onclick={async () => {
			// Handle forgot password logic here
			await authClient.signIn.social({
				provider: 'github'
			});
		}}
	>
		<Github class="mr-2" />
		{localization?.SIGN_IN_WITH_GITHUB ?? 'Sign in with GitHub'}
	</Button>
</form>

<style>
	/* Add any scoped styles here if needed */
</style>
