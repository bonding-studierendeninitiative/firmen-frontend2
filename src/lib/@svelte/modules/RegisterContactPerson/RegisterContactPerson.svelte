<script lang="ts">
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form/index.js';
	import { _ } from '@services/i18n';
	import { Input } from '@/components/ui/input/index.js';
	import { PhoneInput } from '@/@svelte/components/PhoneInput/index.js';
	import { type SuperValidated } from 'sveltekit-superforms';
	import { ContactPersonRegistrationForm } from '@schema';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { signOut } from '@auth/sveltekit/client';

	export let validated: SuperValidated<ContactPersonRegistrationForm>;
	const superform = superForm<ContactPersonRegistrationForm>(validated, {
		validators: valibot(ContactPersonRegistrationForm),
		applyAction: true,
		invalidateAll: 'force',
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success($_('user-pages.contactPersons.signUp.successCreated'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	const { form: formData, enhance } = superform;
</script>

<form class="my-4" action="?/registerUser" method="POST" id="register-contact-person-form" use:enhance>
	<div class=" flex flex-col gap-4">
		<!--
		<Field form={superform} name="title">
			<Control let:attrs>
				<Label>{$_('user-pages.contactPersons.signUp.labels.title')}</Label>

				<Input
					{...attrs}
					bind:value={$formData.title}
					placeholder={$_('user-pages.contactPersons.signUp.placeholders.title')}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		-->
		<Field form={superform} name="fullName">
			<Control let:attrs>
				<Label>{$_('user-pages.contactPersons.signUp.labels.fullName')}</Label>

				<Input
					{...attrs}
					bind:value={$formData.fullName}
					placeholder={$_('user-pages.contactPersons.signUp.placeholders.fullName')}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="responsibility">
			<Control let:attrs>
				<Label
				>{$_(
					'user-pages.contactPersons.signUp.labels.responsibility'
				)}</Label
				>
				<Input
					{...attrs}
					bind:value={$formData.responsibility}
					placeholder={$_(
											'user-pages.contactPersons.signUp.placeholders.responsibility'
										)}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="email">
			<Control let:attrs>
				<Label>{$_('user-pages.contactPersons.signUp.labels.email')}</Label>
				<Description>{$_('user-pages.contactPersons.signUp.hints.email')}</Description>
				<Input
					{...attrs}
					bind:value={$formData.email}
					placeholder={$_(
								'user-pages.contactPersons.signUp.placeholders.email'
							)}
				/>
			</Control>
			<FieldErrors />
		</Field>
		<Field form={superform} name="phoneNumber">
			<Control let:attrs>
				<Label>{$_('user-pages.contactPersons.signUp.labels.phoneNumber')}</Label>
				<!--// bind:selectedCountry={$formData.countryCode}-->
				<PhoneInput
					searchPlaceholder={$_(
								'user-pages.contactPersons.signUp.placeholders.phoneCountryCodeSearch'
							)}
					bind:value={$formData.phoneNumber}
					{...attrs}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>

		<footer>
			<footer class=" flex justify-end items-center w-full">
				<Button variant="secondary"  class="mr-2" on:click={() => signOut()}>{$_('common.back')}</Button>
				<Button type="submit" form="register-contact-person-form">{$_('common.continue')}</Button>
			</footer>
		</footer>
	</div>
</form>

