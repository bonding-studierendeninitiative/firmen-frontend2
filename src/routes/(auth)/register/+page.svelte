<script>
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';

	const handleRegisterClick = () => {
		goto('/login');
	};
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 py-8">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">Registrierung</p>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<Input placeholder="Vorname" />
		<Input placeholder="Nachname" />
	</div>
	<Input classes="mt-4" placeholder="Unternehmensname" />
	<Input classes="mt-4" placeholder="Rufnummer" />
	<Input classes="mt-4" placeholder="E-Mail Adresse" />
	<Input classes="mt-4" placeholder="Passwort" />
	<Input classes="mt-4" placeholder="Passwort bestätigen" />
	<div class=" flex justify-end items-center mt-5 font-medium">
		<p class=" text-brand cursor-pointer font-bold">Passwort vergessen?</p>
	</div>
	<GradientButton classes=" mt-5" onClick={handleRegisterClick}>Konto erstellen</GradientButton>
</div>
