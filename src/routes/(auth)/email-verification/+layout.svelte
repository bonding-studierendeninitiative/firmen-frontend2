<script>
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
</script>

<LoginWrapper
	heading={$_('auth.forgotPassword.headingVerifyEmail')}
	subHeading={$_('auth.forgotPassword.subHeadingVerifyEmail')}
>
	<slot />
</LoginWrapper>
