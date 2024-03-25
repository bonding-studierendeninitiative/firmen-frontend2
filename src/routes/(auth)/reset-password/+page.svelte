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
	import { _ } from '../../../services/i18n';

	const handleSubmitResetPassword = () => {
		goto('login');
	};
	const handleRedirectToLogin = () => {
		goto('login');
	};

	let password: string;
</script>

<Input
	classes="mt-4"
	placeholder={$_('common.fields.passwordPlaceholder')}
	type="password"
	bind:value={password}
/>
<Input classes="mt-4" placeholder={$_('common.fields.confirmPassword')} type="password" />

<div class="grid grid-cols-2 gap-4 mt-4">
	<PasswordComplexityMessage
		message={$_('auth.forgotPassword.aLowerCaseLetter')}
		isValid={hasLowerCase(password)}
	/>
	<PasswordComplexityMessage
		message={$_('auth.forgotPassword.aSpecialCharacter')}
		isValid={hasSpecialCharacter(password)}
	/>
	<PasswordComplexityMessage
		message={$_('auth.forgotPassword.anUpperCaseLetter')}
		isValid={hasUpperCase(password)}
	/>
	<PasswordComplexityMessage
		message={$_('auth.forgotPassword.atLeast8Characters')}
		isValid={hasMinAllowedCharacters(password)}
	/>
	<PasswordComplexityMessage
		message={$_('auth.forgotPassword.aNumber')}
		isValid={hasNumber(password)}
	/>
</div>

<GradientButton classes=" mt-5 w-full" onClick={handleSubmitResetPassword}
	>{$_('auth.forgotPassword.resetPasswordButton')}</GradientButton
>
<div class=" flex justify-center items-center mt-5">
	<button class=" text-brand cursor-pointer font-bold" on:click={handleRedirectToLogin}>
		{$_('auth.forgotPassword.backToLogin')}
	</button>
</div>
