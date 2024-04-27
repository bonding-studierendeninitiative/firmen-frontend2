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
		<Input placeholder={$_('auth-fields.firstName')} />
		<Input placeholder={$_('auth-fields.lastName')} />
	</div>
	<Input classes="mt-4" placeholder={$_('auth-fields.companyName')} />
	<Input classes="mt-4" placeholder={$_('auth-fields.phoneNumber')} />
	<Input classes="mt-4" placeholder={$_('auth-fields.emailPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('auth-fields.passwordPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('auth-fields.confirmPassword')} />
	<GradientButton classes=" mt-5 w-full" onClick={handleRegisterClick}
		>{$_('auth.registration.createAccount')}</GradientButton
	>
</LoginWrapper>
