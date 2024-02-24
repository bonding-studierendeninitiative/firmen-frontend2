<script>
	import { Input, GradientButton } from '$lib/@svelte';
	import { goto } from '$app/navigation';
	import { _ } from '../../../services/i18n';

	const handleRegisterClick = () => {
		goto('/registration-success');
	};
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 py-8">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">{$_('auth.registration.heading')}</p>
	</div>
	<div class="grid grid-cols-2 gap-4">
		<Input placeholder={$_('common.fields.firstName')} />
		<Input placeholder={$_('common.fields.lastName')} />
	</div>
	<Input classes="mt-4" placeholder={$_('common.fields.companyName')} />
	<Input classes="mt-4" placeholder={$_('common.fields.phoneNumber')} />
	<Input classes="mt-4" placeholder={$_('common.fields.emailPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('common.fields.passwordPlaceholder')} />
	<Input classes="mt-4" placeholder={$_('common.fields.confirmPassword')} />
	<GradientButton classes=" mt-5" onClick={handleRegisterClick}
		>{$_('auth.registration.createAccount')}</GradientButton
	>
</div>
