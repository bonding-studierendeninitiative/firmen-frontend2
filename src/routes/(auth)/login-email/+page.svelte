<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input } from '$lib/@svelte';
	const handleSubmitEmail = () => {
		goto('/login-code');
	};
	const handleJoinNow = () => {
		goto('register');
	};

	let password: string;
</script>

<Input classes="mt-4" placeholder="E-Mail Addresse" type="email" bind:value={password} />

<GradientButton classes=" mt-5" onClick={handleSubmitEmail}>Continue</GradientButton>
<div class=" flex justify-center items-center mt-5">
	<p class=" text-stone-500 font-normal mr-4">Kein Mitglied?</p>
	<button class=" text-brand cursor-pointer font-bold" on:click={handleJoinNow}>
		Jetzt registrieren
	</button>
</div>
