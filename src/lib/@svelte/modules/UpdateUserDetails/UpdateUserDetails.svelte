<script lang="ts">
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form/index.js';
	import { _ } from '@services/i18n';
	import { Input } from '@/components/ui/input/index.js';
	import { PhoneInput } from '@/@svelte/components/PhoneInput/index.js';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Button } from '@/components/ui/button';
	import { type UpdateUserDetails, UpdateUserDetailsRequest } from '@schema';
	import { useClerkContext } from 'svelte-clerk';

	interface Props {
		validated: SuperValidated<Infer<UpdateUserDetails>>;
	}

	let { validated }: Props = $props();
	const superform = superForm<Infer<UpdateUserDetails>>(validated, {
		validators: valibot(UpdateUserDetailsRequest),
		applyAction: true,
		invalidateAll: 'force',
		onResult({ result }) {
			console.log(result);
			if (result.type === 'success') {
				toast.success($_('user-pages.contactPersons.signUp.successCreated'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}

	});

	const ctx = useClerkContext()
	const { form: formData, enhance } = superform;
</script>

<form
	class="my-4"
	action="?/registerUser"
	method="POST"
	id="register-contact-person-form"
	use:enhance
>
	<div class=" flex flex-col gap-4">
		<Field form={superform} name="title">
			<Control >
				{#snippet children({ props })}
								<Label>{$_('user-pages.contactPersons.signUp.labels.title')}</Label>

					<Input
						{...props}
						bind:value={$formData.title}
						placeholder={$_('user-pages.contactPersons.signUp.placeholders.title')}
					/>
											{/snippet}
						</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="position">
			<Control >
				{#snippet children({ props })}
								<Label>{$_('user-pages.contactPersons.signUp.labels.responsibility')}</Label>
					<Input
						{...props}
						bind:value={$formData.position}
						placeholder={$_('user-pages.contactPersons.signUp.placeholders.responsibility')}
					/>
											{/snippet}
						</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="phone">
			<Control >
				{#snippet children({ props })}
								<Label>{$_('user-pages.contactPersons.signUp.labels.phoneNumber')}</Label>
					<!--// bind:selectedCountry={$formData.countryCode}-->
					<PhoneInput
						searchPlaceholder={$_(
							'user-pages.contactPersons.signUp.placeholders.phoneCountryCodeSearch'
						)}
						bind:value={$formData.phone}
						{...props}
					/>
											{/snippet}
						</Control>
			<Description />
			<FieldErrors />
		</Field>

		<footer>
			<footer class=" flex justify-end items-center w-full">
				<Button variant="secondary" class="mr-2" onclick={() => ctx.clerk?.signOut({
					redirectUrl: "https://bonding.de"
				})}>{$_('common.back')}</Button>
				<Button type="submit" form="register-contact-person-form">{$_('common.continue')}</Button>
			</footer>
		</footer>
	</div>
</form>