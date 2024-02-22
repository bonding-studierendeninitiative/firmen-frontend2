<script>
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte';
	const handleRegistration = () => {
		goto('/register');
	};
</script>

<LoginWrapper>
	<slot />
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">Kein Mitglied?</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleRegistration}>
			Jetzt registrieren
		</button>
	</div>
</LoginWrapper>
