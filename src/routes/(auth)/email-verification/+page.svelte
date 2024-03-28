<script lang="ts">
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte';
	import { GradientButton, VerificationCode } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
	const handleSubmitCode = () => {
		goto('/reset-password');
	};
	const handleResendCode = () => {};
</script>

<LoginWrapper
	heading={$_('auth.forgotPassword.headingVerifyEmail')}
	subHeading={$_('auth.forgotPassword.subHeadingVerifyEmail')}
>
	<VerificationCode />
	<GradientButton classes=" mt-5 w-full" onClick={handleSubmitCode}
		>{$_('auth.forgotPassword.verifyCode')}</GradientButton
	>
	<div class=" flex justify-center items-center mt-5">
		<button class=" text-brand cursor-pointer font-bold" on:click={handleResendCode}>
			{$_('auth.forgotPassword.resend')}
		</button>
	</div>
</LoginWrapper>
