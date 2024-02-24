<script>
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
</script>

<LoginWrapper
	heading={$_('auth.forgotPassword.heading')}
	subHeading={$_('auth.forgotPassword.subHeading')}
>
	<slot />
</LoginWrapper>
