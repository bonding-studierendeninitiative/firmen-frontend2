<script lang="ts">
	import { _ } from '@services';
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { API } from '@api';
	import { REGISTRATION } from '@api-routes';
	import { registrationSchema } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';
	import toast from 'svelte-french-toast';

	let isSubmitted = false;
	const formData = {
		firstName: '',
		lastName: '',
		companyName: '',
		phoneNumber: '',
		email: '',
		password: '',
		cPassword: ''
	};
	type FormErrors = Partial<typeof formData>;
	let errors: FormErrors;

	$: {
		formData;
		validateData();
	}

	const validateData = () => {
		if (!isSubmitted) return;
		const validate = registrationSchema.safeParse(formData);
		errors = formatZodErrors(validate);
	};
	const handleRegisterClick = async () => {
		isSubmitted = true;
		validateData();
		if (errors) return;
		API.post({ route: REGISTRATION, data: formData })
			.then((res) => {
				const { status } = res;
				console.log({ res });
				if (status === 200) {
					goto('/registration-success');
				}
			})
			.catch((err) => {
				toast.error($_('common.somethingWentWrong'));
			});
	};
</script>

<LoginWrapper heading={$_('auth.registration.heading')}>
	<div class="grid grid-cols-1 gap-2">
		<div class="grid grid-cols-2 gap-4">
			<Input
				placeholder={$_('auth-fields.firstName')}
				bind:value={formData.firstName}
				errorMessage={errors?.firstName}
			/>
			<Input
				placeholder={$_('auth-fields.lastName')}
				bind:value={formData.lastName}
				errorMessage={errors?.lastName}
			/>
		</div>
		<Input
			classes="mt-4"
			placeholder={$_('auth-fields.companyName')}
			bind:value={formData.companyName}
			errorMessage={errors?.companyName}
		/>
		<Input
			classes="mt-4"
			placeholder={$_('auth-fields.phoneNumber')}
			bind:value={formData.phoneNumber}
			errorMessage={errors?.phoneNumber}
		/>
		<Input
			classes="mt-4"
			placeholder={$_('auth-fields.emailPlaceholder')}
			bind:value={formData.email}
			errorMessage={errors?.email}
			type="email"
		/>
		<Input
			classes="mt-4"
			placeholder={$_('auth-fields.passwordPlaceholder')}
			bind:value={formData.password}
			errorMessage={errors?.password}
		/>
		<Input
			classes="mt-4"
			placeholder={$_('auth-fields.confirmPassword')}
			bind:value={formData.cPassword}
			errorMessage={errors?.cPassword}
		/>
		<GradientButton classes=" mt-5 w-full" onClick={handleRegisterClick}
			>{$_('auth.registration.createAccount')}</GradientButton
		>
	</div>
</LoginWrapper>
