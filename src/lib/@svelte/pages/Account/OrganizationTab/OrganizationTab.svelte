<script lang="ts">
	import { _ } from '@services';
	import { Input } from '$lib/@svelte/components';
	import { Button } from '@/components/ui/button';
	import {
		type CreateOrgInviteRequest,
		CreateOrgInviteRequestSchema,
		GetOrgDetailsResponse,
		type GetOrgMembersResponse,
		type SetOrgDetailsRequest,
		SetOrgDetailsRequestSchema
	} from '@schema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import { PhoneInput } from '@/@svelte/components/PhoneInput';

	export let editOrganizationDetailsForm: SuperValidated<SetOrgDetailsRequest> | undefined;

	const superform = superForm<SetOrgDetailsRequest>(editOrganizationDetailsForm, {
		validators: valibot(SetOrgDetailsRequestSchema),
		dataType: 'json',
		invalidateAll: 'force',
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success($_('common.saved'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});

	const { form: formData, enhance } = superform;
</script>

<pre>
	{JSON.stringify($formData, null, 2)}
</pre>
<div>
	<form action="?/updateOrg" method="post" use:enhance>
		<div class=" flex flex-col gap-1">
			<Field form={superform} name="name">
				<Control let:attrs>
					<Label>{$_('user-pages.organizations.createOrganization.labels.organizationName')}</Label>
					<Input
						{...attrs}
						bind:value={$formData.name}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationName'
						)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="organizationPhone">
				<Control let:attrs>
					<Label>{$_('user-pages.organizations.createOrganization.labels.organizationPhone')}</Label
					>
					<PhoneInput
						bind:selectedCountry={$formData.organizationAddress.country}
						searchPlaceholder={$_(
							'user-pages.organizations.createOrganization.placeholders.phoneCountryCodeSearch'
						)}
						bind:value={$formData.organizationPhone}
						{...attrs}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="organizationEmail">
				<Control let:attrs>
					<Label>{$_('user-pages.organizations.createOrganization.labels.organizationEmail')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.organizationEmail}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationEmail'
						)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="organizationWebsite">
				<Control let:attrs>
					<Label
						>{$_('user-pages.organizations.createOrganization.labels.organizationWebsite')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.organizationWebsite}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationWebsite'
						)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="street">
				<Control let:attrs>
					<Label
						>{$_(
							'user-pages.organizations.createOrganization.labels.organizationStreetAddress'
						)}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.organizationAddress.street}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationStreetAddress'
						)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="extendedAddress">
				<Control let:attrs>
					<Label
						>{$_(
							'user-pages.organizations.createOrganization.labels.organizationExtendedAddress'
						)}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.organizationAddress.extendedAddress}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationExtendedAddress'
						)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<div class="flex gap-4">
				<div class="max-w-28">
					<div class="mt-1">
						<Field form={superform} name="zipCode">
							<Control let:attrs>
								<Label
									>{$_(
										'user-pages.organizations.createOrganization.labels.organizationZipCode'
									)}</Label
								>
								<Input
									{...attrs}
									bind:value={$formData.organizationAddress.zipCode}
									placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationZipCode'
									)}
								/>
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</div>
				</div>
				<div class="flex-grow">
					<div class="mt-1">
						<Field form={superform} name="locality">
							<Control let:attrs>
								<Label
									>{$_(
										'user-pages.organizations.createOrganization.labels.organizationLocality'
									)}</Label
								>
								<Input
									{...attrs}
									bind:value={$formData.organizationAddress.locality}
									placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationLocality'
									)}
								/>
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</div>
					<footer>
						<footer class=" flex justify-end items-center w-full">
							<Button type="submit">{$_('common.save')}</Button>
						</footer>
					</footer>
				</div>
			</div>
		</div>
	</form>
	<!--
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.settings.companyInformation')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.settings.companyInformationSubHeading')}
		</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.companyName')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.settings.companyName')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.address')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.settings.address')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.cityState')}
			</div>
			<div class="col-span-3">
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Select placeholder={$_('user-pages.settings.city')} />
					<Select placeholder={$_('user-pages.settings.state')} />
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.country')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.settings.country')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.salesTaxIDOptional')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.settings.saleTaxID')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.settings.website')}
			</div>
			<div class="col-span-3">
				<InputWithPrefix prefixText="https://" placeholder={$_('user-pages.settings.website')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Linkedin</div>
			<div class="col-span-3">
				<InputWithPrefix prefixText="https://www.linkedin.com/" placeholder="Linkedin" />
			</div>
		</div>
	</section>

	<footer>
		<div class=" flex justify-end items-center my-6 pb-6">
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
				<GradientButton onClick={() => goto('/dashboard')}>{$_('common.save')}</GradientButton>
			</div>
		</div>
	</footer>
	-->
</div>
