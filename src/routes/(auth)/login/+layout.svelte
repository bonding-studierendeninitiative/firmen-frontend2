<script>
	import { LoginWrapper } from '$lib/@svelte';
	import { _ } from '../../../services/i18n';
</script>

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<slot />
</LoginWrapper>
