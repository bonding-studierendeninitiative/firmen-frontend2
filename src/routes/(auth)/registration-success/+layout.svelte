<script>
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
</script>

<LoginWrapper
	heading={$_('auth.registration-success.heading')}
	subHeading={$_('auth.registration-success.subHeading')}
>
	<slot />
</LoginWrapper>
