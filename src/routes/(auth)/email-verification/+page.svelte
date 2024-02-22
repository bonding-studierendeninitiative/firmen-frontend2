<script lang="ts">
	import { GradientButton, VerificationCode } from '$lib/@svelte';
	const handleSubmitCode = () => {};
	const handleResendCode = () => {};
</script>

<VerificationCode />
<GradientButton classes=" mt-5" onClick={handleSubmitCode}>Passwort zurücksetzen</GradientButton>
<div class=" flex justify-center items-center mt-5">
	<button class=" text-brand cursor-pointer font-bold" on:click={handleResendCode}>
		Erneut senden
	</button>
</div>
