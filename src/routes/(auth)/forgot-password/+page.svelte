<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
	const handleSubmitEmail = () => {
		goto('/email-verification');
	};
	const handleRedirectToLogin = () => {
		goto('login');
	};

	let password: string;
</script>

<Input
	classes="mt-4"
	placeholder={$_('common.fields.emailPlaceholder')}
	type="email"
	bind:value={password}
/>

<GradientButton classes=" mt-5" onClick={handleSubmitEmail}
	>{$_('auth.forgotPassword.resetPassword')}</GradientButton
>
<div class=" flex justify-center items-center mt-5">
	<button class=" text-brand cursor-pointer font-bold" on:click={handleRedirectToLogin}>
		{$_('auth.forgotPassword.backToLogin')}
	</button>
</div>
