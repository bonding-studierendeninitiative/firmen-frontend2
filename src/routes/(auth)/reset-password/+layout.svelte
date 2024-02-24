<script>
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
</script>

<LoginWrapper
	heading={$_('auth.forgotPassword.headingEnterNewPassword')}
	subHeading={$_('auth.forgotPassword.subHeadingEnterNewPassword')}
>
	<slot />
</LoginWrapper>
