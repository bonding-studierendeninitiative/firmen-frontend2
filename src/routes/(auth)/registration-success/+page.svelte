<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton } from '$lib/@svelte';
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';

	const handleSubmit = () => {
		goto('/access-preference');
	};
</script>

<LoginWrapper
	heading={$_('auth.registration-success.heading')}
	subHeading={$_('auth.registration-success.subHeading')}
>
	<GradientButton classes=" mt-5 w-full" onClick={handleSubmit}
		>{$_('common.continue')}</GradientButton
	>
</LoginWrapper>
