<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input } from '$lib/@svelte';
	const handleSubmitEmail = () => {
		goto('/login-code');
	};
	const handleRedirectToLogin = () => {
		goto('login');
	};

	let password: string;
</script>

<Input classes="mt-4" placeholder="E-Mail Addresse" type="email" bind:value={password} />

<GradientButton classes=" mt-5" onClick={handleSubmitEmail}>Passwort zurücksetzen</GradientButton>
<div class=" flex justify-center items-center mt-5">
	<button class=" text-brand cursor-pointer font-bold" on:click={handleRedirectToLogin}>
		Zurück zum Login
	</button>
</div>
