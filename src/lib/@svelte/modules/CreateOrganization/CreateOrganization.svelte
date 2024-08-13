<script lang="ts">
	import { Drawer, Input, Select } from '$lib/@svelte/components';
	import { _ } from '@services';
	import Button from '../../components/Button/Button.svelte';
	import GradientButton from '../../components/GradientButton/GradientButton.svelte';
	import { page } from '$app/stores';
	import { PhoneInput } from '$lib/@svelte/components/PhoneInput';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { CreateOrganizationRequest } from '$lib/services/organizations';

	export let superForm: SuperForm<CreateOrganizationRequest>;
	const { form, constraints } = superForm;
	export let isOpen = false;
</script>
<Drawer handleSubmit={() => {
	console.log("Submit was handled in CreateOrganization");
}} heading={$_('user-pages.organizations.newOrganization')}
				hasActions={false} bind:isOpen>
	<form action="?/createOrg" method="post">
		<div class=" flex flex-col gap-6">
			<Input name="organization-name" label={$_('user-pages.organizations.createOrganization.labels.organizationName')}
						 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationName')}
						 bind:value={$form.name} {...$constraints.name} />
			<Select name="organization-size" label={$_('user-pages.organizations.createOrganization.labels.organizationSize')}
							placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationSize')}
							items={[{label: "1-5", value: "1-5"}, {label: "6-20", value: "6-20"}, {label: "20+", value: "20+"}]}
							bind:value={$form.size} {...$constraints.size} />
			<Select name="organization-type" label={$_('user-pages.organizations.createOrganization.labels.organizationType')}
							placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationType')}
							items={[{label: "Company", value: "company"}, {label: "Non-Profit", value: "nonprofit"}, {label: "Other", value: "other"} ]}
							bind:value={$form.type} {...$constraints.type} >
			</Select>
			<PhoneInput selectedCountry="DE" name="organization-phone"
									label={$_('user-pages.organizations.createOrganization.labels.organizationPhone')}
									searchPlaceholder={$_('user-pages.organizations.createOrganization.phoneCountryCodeSearch')}
									bind:value={$form.phone} {...$constraints.phone} />
			<Input name="organization-email"
						 label={$_('user-pages.organizations.createOrganization.labels.organizationEmail')}
						 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationEmail')}
						 bind:value={$form.email} {...$constraints.email} />
			<Input name="organization-street-address"
						 label={$_('user-pages.organizations.createOrganization.labels.organizationStreetAddress')}
						 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationStreetAddress')}
						 bind:value={$form.streetAddress} {...$constraints.streetAddress} />
			<Input name="organization-extended-address"
						 label={$_('user-pages.organizations.createOrganization.labels.organizationExtendedAddress')}
						 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationExtendedAddress')}
						 bind:value={$form.extendedAddress} {...$constraints.extendedAddress} />
			<div class="flex gap-4">
				<div class="max-w-28">
					<div class="mt-1">
						<Input name="organization-zip-code"
									 label={$_('user-pages.organizations.createOrganization.labels.organizationZipCode')}
									 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationZipCode')}
									 bind:value={$form.zipCode} {...$constraints.zipCode} />
					</div>
				</div>
				<div class="flex-grow">
					<div class="mt-1">
						<Input name="organization-locality"
									 label={$_('user-pages.organizations.createOrganization.labels.organizationLocality')}
									 placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationLocality')}
									 bind:value={$form.locality} {...$constraints.locality} />
					</div>
				</div>
			</div>
			<footer>
				<footer class=" flex justify-end items-center w-full">
					<Button classes="mr-2" onClick={() => (isOpen = false)}>{$_('common.cancel')}</Button>
					<GradientButton type="submit" form={$page.form}>{$_('common.save')}</GradientButton>
				</footer>
			</footer>
		</div>
	</form>
</Drawer>