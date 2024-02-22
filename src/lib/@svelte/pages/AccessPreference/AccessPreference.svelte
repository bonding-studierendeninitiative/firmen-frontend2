<script>
	import { Button, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';

	const handleMagicClick = () => {
		goto('/login-email');
	};
	const handleLoginClick = () => {
		goto('/login');
	};
</script>

<GradientButton classes=" mt-5" onClick={handleMagicClick}>Login with Magic Link</GradientButton>
<Button
	onClick={handleLoginClick}
	classes="shadow-md border border-solid border-stone-200 border-1  !text-stone-800 !font-extrabold mt-5"
	>Login with Password</Button
>
