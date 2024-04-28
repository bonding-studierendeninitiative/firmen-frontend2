<script lang="ts">
	import { goto } from '$app/navigation';
	import { GradientButton, Input } from '$lib/@svelte/components';
	import { LoginWrapper } from '$lib/@svelte/layouts';
	import { _ } from '@services';
	import { API } from '@api';
	import { MAGIC_GENERATE_OTP } from '@api-routes';
	import { magicGenerateOTPSchema } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';
	import toast from 'svelte-french-toast';

	const handleJoinNow = () => {
		goto('register');
	};
	let isSubmitted = false;
	const formData = {
		email: ''
	};
	type FormErrors = Partial<typeof formData>;
	let errors: FormErrors;

	$: {
		formData;
		validateData();
	}

	const validateData = () => {
		if (!isSubmitted) return;
		const validate = magicGenerateOTPSchema.safeParse(formData);
		errors = formatZodErrors(validate);
	};
	const handleSubmitEmail = async () => {
		goto('/login-code');
		return;
		isSubmitted = true;
		validateData();
		if (errors) return;
		API.post({ route: MAGIC_GENERATE_OTP, data: formData })
			.then((res) => {
				const { status } = res;
				console.log({ res });
				if (status === 200) {
					goto('/login-code');
				}
			})
			.catch((err) => {
				toast.error($_('common.somethingWentWrong'));
			});
	};
</script>

<LoginWrapper heading={$_('auth.login.heading')} subHeading={$_('auth.login.subHeading')}>
	<Input
		classes="mt-4"
		placeholder={$_('auth-fields.emailPlaceholder')}
		type="email"
		bind:value={formData.email}
		errorMessage={errors?.email}
	/>

	<GradientButton classes=" mt-5 w-full" onClick={handleSubmitEmail}
		>{$_('common.continue')}</GradientButton
	>
	<div class=" flex justify-center items-center mt-5">
		<p class=" text-stone-500 font-normal mr-4">{$_('auth.login.notAMember')}</p>
		<button class=" text-brand cursor-pointer font-bold" on:click={handleJoinNow}>
			{$_('auth.login.joinNow')}
		</button>
	</div>
</LoginWrapper>
