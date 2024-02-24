<script>
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';

	const handleRegistration = () => {
		goto('/register');
	};
</script>

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<slot />
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">{$_('auth.login.notAMember')}</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleRegistration}>
			{$_('auth.login.joinNow')}
		</button>
	</div>
</LoginWrapper>
