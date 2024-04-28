<script lang="ts">
	import { _ } from '@services';
	import { Input, GradientButton } from '$lib/@svelte/components';
	import { goto } from '$app/navigation';
	import { API } from '@api';
	import { ADMIN_LOGIN } from '@api-routes';
	import { adminLoginSchema } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';
	import toast from 'svelte-french-toast';

	let isSubmitted = false;
	const formData = {
		email: '',
		password: ''
	};
	type FormErrors = Partial<typeof formData>;
	let errors: FormErrors;

	$: {
		formData;
		validateData();
	}

	const validateData = () => {
		if (!isSubmitted) return;
		const validate = adminLoginSchema.safeParse(formData);
		errors = formatZodErrors(validate);
	};

	const handleLoginClick = async () => {
		isSubmitted = true;
		validateData();
		if (errors) return;
		API.post({ route: ADMIN_LOGIN, data: formData })
			.then((res) => {
				const { status } = res;
				console.log({ res });
				if (status === 200) {
					goto('/admin/dashboard');
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
			});
	};
</script>

<div class=" w-4/6 lg:w-3/6 xl:w-98 m-10 pb-24">
	<div class="mb-10">
		<p class=" text-stone-950 text-3xl font-bold">{$_('auth.login.heading')}</p>
		<p class=" text-stone-500 font-semi-light mt-2">{$_('auth.login.subHeading')}</p>
	</div>
	<div class=" grid grid-cols-1 gap-6">
		<Input
			placeholder={$_('auth-fields.emailPlaceholder')}
			bind:value={formData.email}
			errorMessage={errors?.email}
			type="email"
		/>
		<Input
			placeholder={$_('auth-fields.passwordPlaceholder')}
			bind:value={formData.password}
			errorMessage={errors?.password}
			type="password"
		/>
	</div>
	<GradientButton classes=" mt-8 w-full" onClick={handleLoginClick}
		>{$_('auth.login.login')}</GradientButton
	>
</div>
