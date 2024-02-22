<script>
	import { Input, GradientButton } from '$lib/@svelte';
	import { goto } from '$app/navigation';

	const handleLoginClick = () => {
		goto('/dashboard');
	};

	const handleRegistration = () => {
		goto('/register');
	};
	const handleForgotPassword = () => {
		goto('/forgot-password');
	};
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 pb-24">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">Login</p>
		<p class=" text-stone-500 font-semi-light mt-2">Geben Sie Ihre Anmeldedaten ein</p>
	</div>
	<Input placeholder="E-Mail Addresse" />
	<Input classes="mt-4" placeholder="Passwort" type="password" />
	<div class=" flex justify-end items-center mt-5 font-medium cursor-pointer">
		<button class=" text-brand cursor-pointer font-bold" on:click={handleForgotPassword}
			>Passwort vergessen?</button
		>
	</div>
	<GradientButton classes=" mt-5" onClick={handleLoginClick}>Login</GradientButton>
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">Kein Mitglied?</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleRegistration}>
			Jetzt registrieren
		</button>
	</div>
</div>
