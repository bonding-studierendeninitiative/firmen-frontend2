<script lang="ts">
	import { Button, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { _ } from '@services';

	const handleRegistration = () => {
		goto('/register');
	};
	const handleMagicClick = () => {
		goto('/login-email');
	};
	const handleLoginClick = () => {
		goto('/login');
	};
</script>

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<GradientButton classes=" mt-5 w-full" onClick={handleMagicClick}
		>{$_('auth.login.loginWithMagicLink')}</GradientButton
	>
	<Button onClick={handleLoginClick} classes="shadow-md  w-full !font-extrabold mt-5"
		>{$_('auth.login.loginWithPassword')}</Button
	>
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">{$_('auth.login.notAMember')}</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleRegistration}>
			{$_('auth.login.joinNow')}
		</button>
	</div>
</LoginWrapper>
