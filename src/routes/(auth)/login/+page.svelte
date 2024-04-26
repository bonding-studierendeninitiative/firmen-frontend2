<script>
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { goto } from '$app/navigation';
	import { _ } from '@services';

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

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<Input placeholder={$_('common.fields.emailPlaceholder')} type="email" />
	<Input classes="mt-4" placeholder={$_('common.fields.passwordPlaceholder')} type="password" />
	<div class=" flex justify-end items-center mt-5 font-medium cursor-pointer">
		<button class=" text-brand cursor-pointer font-bold" on:click={handleForgotPassword}
			>{$_('auth.login.forgotPassword')}</button
		>
	</div>
	<GradientButton classes=" mt-5 w-full" onClick={handleLoginClick}
		>{$_('auth.login.login')}</GradientButton
	>
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">{$_('auth.login.notAMember')}</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleRegistration}>
			{$_('auth.login.joinNow')}
		</button>
	</div>
</LoginWrapper>
