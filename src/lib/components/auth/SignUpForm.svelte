<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';

	interface Props {
		className?: string;
		classNames?: any;
		localization?: any;
		redirectTo?: string;
		isSubmitting?: boolean;
		callbackURL?: string;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		redirectTo = '',
		isSubmitting = false,
		callbackURL = ''
	}: Props = $props();

	let name = $state('');
	let email = $state('');
	let password = '';
	let confirmPassword = '';
	let error: string | null = $state(null);

	async function handleSubmit(event?: Event) {
		event?.preventDefault();
		error = null;
		if (!name || !email || !password || !confirmPassword) {
			error = localization?.FIELDS_REQUIRED ?? 'All fields are required';
			return;
		}
		if (password !== confirmPassword) {
			error = localization?.PASSWORDS_DO_NOT_MATCH ?? 'Passwords do not match';
			return;
		}

		// TODO: Implement actual sign up logic
		console.log('Sign up:', { name, email, password, callbackURL });
	}
</script>

<form onsubmit={handleSubmit} class={`grid w-full gap-6 ${className} ${classNames?.base ?? ''}`}>
	{#if error}
		<div class="text-red-500 text-sm">{error}</div>
	{/if}

	<!-- Name input -->
	<div class="grid gap-2">
		<Label for="name">{localization?.NAME ?? 'Name'}</Label>
		<Input
			id="name"
			type="text"
			bind:value={name}
			placeholder={localization?.NAME_PLACEHOLDER ?? 'Enter your name'}
			disabled={isSubmitting}
			class={classNames?.input ?? ''}
		/>
	</div>

	<!-- Email input -->
	<div class="grid gap-2">
		<Label for="email">{localization?.EMAIL ?? 'Email'}</Label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			placeholder={localization?.EMAIL_PLACEHOLDER ?? 'Enter your email'}
			disabled={isSubmitting}
			class={classNames?.input ?? ''}
		/>
	</div>

	<!-- Submit button -->
	<Button type="submit" disabled={isSubmitting} class={`w-full ${classNames?.button ?? ''}`}>
		{isSubmitting
			? (localization?.SIGNING_UP ?? 'Signing up...')
			: (localization?.SIGN_UP_ACTION ?? 'Sign up')}
	</Button>
</form>

<style>
	/* Add any scoped styles here if needed */
</style>
