<script lang="ts">
	import { _ } from '@services';
	import { Button } from '@/components/ui/button';
	import {
		type SetOrgDetailsRequest,
		SetOrgDetailsRequestSchema
	} from '@schema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import { PhoneInput } from '@/@svelte/components/PhoneInput';
	import { Input } from '@/components/ui/input';
	import * as Card from '@/components/ui/card';

	export let editOrganizationDetailsForm: SuperValidated<SetOrgDetailsRequest>;

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

	const { form: formData, enhance, submitting } = superform;
</script>
<form class="space-y-12" action="?/updateOrg" method="post" use:enhance>
	<section class="grid gap-x-8 grid-cols-3 @container gap-y-8">
		<div class="@3xl:col-span-1 col-span-3">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.org-details.title')}
			</h2>
			<h4 class=" text-stone-500 text-sm text-balance">
				{$_('user-pages.settings.org-details.description')}
			</h4>
		</div>
		<div class="space-y-6 @3xl:col-span-2 col-span-3">
			<Card.Root>
				<Card.Content class="pt-6">
					<Field form={superform} name="name">
						<Control let:attrs>
							<Label>{$_('user-pages.organizations.createOrganization.labels.organizationName')}</Label>
							<Input
								class="max-w-md"
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
					<Field form={superform} name="organizationAddress.street">
						<Control let:attrs>
							<Label
							>{$_(
								'user-pages.organizations.createOrganization.labels.organizationStreetAddress'
							)}</Label
							>
							<Input
								class="max-w-md"
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
					<Field form={superform} name="organizationAddress.extendedAddress">
						<Control let:attrs>
							<Label
							>{$_(
								'user-pages.organizations.createOrganization.labels.organizationExtendedAddress'
							)}</Label
							>
							<Input
								class="max-w-md"
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
								<Field form={superform} name="organizationAddress.zipCode">
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
								<Field form={superform} name="organizationAddress.locality">
									<Control let:attrs>
										<Label
										>{$_(
											'user-pages.organizations.createOrganization.labels.organizationLocality'
										)}</Label
										>
										<Input
											class="max-w-xs"
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
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="border-t px-6 py-4">
					<Button disabled={$submitting} type="submit">{$_('common.save')}</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
	<section class="grid gap-x-8 grid-cols-3 @container gap-y-8">
		<div class="@3xl:col-span-1 col-span-3">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.org-contact-details.title')}
			</h2>
			<h4 class=" text-stone-500 text-sm text-balance">
				{$_('user-pages.settings.org-contact-details.description')}
			</h4>
		</div>
		<div class="space-y-6 @3xl:col-span-2 col-span-3">
			<Card.Root>
				<Card.Content class="pt-6">
					<Field form={superform} name="organizationPhone">
						<Control let:attrs>
							<Label>{$_('user-pages.organizations.createOrganization.labels.organizationPhone')}</Label
							>
							<PhoneInput
								class="max-w-md"
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
								class="max-w-md"
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
								class="max-w-md"
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
				</Card.Content>
				<Card.Footer class="border-t px-6 py-4">
					<Button disabled={$submitting} type="submit">{$_('common.save')}</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</form>
