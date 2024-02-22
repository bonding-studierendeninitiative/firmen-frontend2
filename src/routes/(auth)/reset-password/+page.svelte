<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input, PasswordComplexityMessage, VerificationCode } from '$lib/@svelte';
	import {
		hasLowerCase,
		hasMinAllowedCharacters,
		hasNumber,
		hasSpecialCharacter,
		hasUpperCase
	} from '$lib/validations';
	const handleSubmitResetPassword = () => {};
	const handleRedirectToLogin = () => {
		goto('login');
	};

	let password: string;
</script>

<Input classes="mt-4" placeholder="Passwort" type="password" bind:value={password} />
<Input classes="mt-4" placeholder="Passwort wiederholen" type="password" />

<div class="grid grid-cols-2 gap-4 mt-4">
	<PasswordComplexityMessage message="ein Kleinbuchstabe " isValid={hasLowerCase(password)} />
	<PasswordComplexityMessage message="ein Sonderzeichen " isValid={hasSpecialCharacter(password)} />
	<PasswordComplexityMessage message="ein Großbuchstabe " isValid={hasUpperCase(password)} />
	<PasswordComplexityMessage
		message="mindestens 8 Zeichen"
		isValid={hasMinAllowedCharacters(password)}
	/>
	<PasswordComplexityMessage message="eine Ziffer" isValid={hasNumber(password)} />
</div>

<GradientButton classes=" mt-5" onClick={handleSubmitResetPassword}
	>Passwort zurücksetzen</GradientButton
>
<div class=" flex justify-center items-center mt-5">
	<button class=" text-brand cursor-pointer font-bold" on:click={handleRedirectToLogin}>
		Zurück zum Login
	</button>
</div>
