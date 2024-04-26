<script>
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { _ } from '@services';

	const handleRegisterClick = () => {
		goto('/registration-success');
	};
</script>

<LoginWrapper heading={$_('auth.registration.heading')}>
	<div class="grid grid-cols-2 gap-4">
		<Input placeholder={$_('common.fields.firstName')} />
		<Input placeholder={$_('common.fields.lastName')} />
	</div>
	<Input classes="mt-4" placeholder={$_('common.fields.companyName')} />
	<Input classes="mt-4" placeholder={$_('common.fields.phoneNumber')} />
	<Input classes="mt-4" placeholder={$_('common.fields.emailPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('common.fields.passwordPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('common.fields.confirmPassword')} />
	<GradientButton classes=" mt-5 w-full" onClick={handleRegisterClick}
		>{$_('auth.registration.createAccount')}</GradientButton
	>
</LoginWrapper>
