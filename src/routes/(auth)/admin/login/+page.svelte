<script>
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';

	const handleLoginClick = () => {
		goto('/dashboard');
	};
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 pb-24">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">Login</p>
		<p class=" text-stone-500 font-semi-light mt-2">Geben Sie Ihre Anmeldedaten ein</p>
	</div>
	<Input placeholder="E-Mail Addresse" />
	<Input classes="mt-4" placeholder="Passwort" />
	<GradientButton classes=" mt-8" onClick={handleLoginClick}>Login</GradientButton>
</div>
