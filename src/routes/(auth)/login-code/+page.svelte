<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input } from '$lib/@svelte/components';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { _ } from '../../../services/i18n';

	const handleSubmitCOde = () => {
		goto('dashboard');
	};
	const handleJoinNow = () => {
		goto('register');
	};

	let password: string;
</script>

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<Input
		classes="mt-4"
		placeholder={$_('common.fields.codePlaceholder')}
		type="number"
		bind:value={password}
	/>

	<GradientButton classes=" mt-5 w-full" onClick={handleSubmitCOde}
		>{$_('auth.login.login')}</GradientButton
	>
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">{$_('auth.login.notAMember')}</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleJoinNow}>
			{$_('auth.login.joinNow')}
		</button>
	</div>
</LoginWrapper>
