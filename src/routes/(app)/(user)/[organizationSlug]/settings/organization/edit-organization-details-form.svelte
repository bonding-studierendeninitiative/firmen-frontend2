<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { PhoneInput } from '@/@svelte/components/PhoneInput';
	import { _ } from '@services';
	import * as Card from '@/components/ui/card';
	import * as Field from '@/components/ui/field';
	import { editOrganizationDetails, editOrganizationAddress } from '@/remote/functions';
	import { toast } from 'svelte-sonner';

	let { orgAddress, orgDetails } = $props();

	if (orgAddress) {
		editOrganizationAddress.fields.set(orgAddress);
	}
	if (orgDetails) {
		editOrganizationDetails.fields.set(orgDetails);
	}
</script>

<form
	class="space-y-12"
	{...editOrganizationAddress.enhance(async ({ submit }) => {
		try {
			await submit();
			if (editOrganizationAddress.result) {
				toast.success($_('user-pages.settings.org-details.update-success'));
				editOrganizationAddress.fields.set(editOrganizationAddress.result);
			}
		} catch (e) {
			console.error(e);
		}
	})}
>
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
				<Card.Content>
					<Field.Set disabled={editOrganizationAddress.pending > 0}>
						<Field.Field>
							<Field.Label for="organizationName">
								{$_('user-pages.organizations.createOrganization.labels.organizationName')}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.entityName.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationName'
								)}
								id="organizationName"
							/>
							{#each editOrganizationAddress.fields.entityName.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label for="organizationStreetAddress">
								{$_('user-pages.organizations.createOrganization.labels.organizationStreetAddress')}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.street.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationStreetAddress'
								)}
								id="organizationStreetAddress"
							/>
							{#each editOrganizationAddress.fields.street.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label for="extendedAddress">
								{$_(
									'user-pages.organizations.createOrganization.labels.organizationExtendedAddress'
								)}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.extendedAddress.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationExtendedAddress'
								)}
								id="extendedAddress"
							/>
							{#each editOrganizationAddress.fields.extendedAddress.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>

						<Field.Group class="flex flex-row gap-4">
							<Field.Field class="mt-1 max-w-28">
								<Field.Label for="organizationZipCode">
									{$_('user-pages.organizations.createOrganization.labels.organizationZipCode')}
								</Field.Label>
								<Input
									{...editOrganizationAddress.fields.zipCode.as('text')}
									placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationZipCode'
									)}
									id="organizationZipCode"
								/>
								{#each editOrganizationAddress.fields.zipCode.issues() ?? [] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							</Field.Field>
							<Field.Field class="mt-1 grow">
								<Field.Label for="organizationLocality">
									{$_('user-pages.organizations.createOrganization.labels.organizationLocality')}
								</Field.Label>
								<Input
									class="max-w-xs"
									{...editOrganizationAddress.fields.locality.as('text')}
									placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationLocality'
									)}
									id="organizationLocality"
								/>
								{#each editOrganizationAddress.fields.locality.issues() ?? [] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							</Field.Field>
						</Field.Group>
						<Field.Field>
							<Field.Label for="organizationCountry">
								{$_('user-pages.organizations.createOrganization.labels.organizationCountry')}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.country.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationCountry'
								)}
								id="organizationCountry"
							/>
							{#each editOrganizationAddress.fields.country.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
					</Field.Set>
				</Card.Content>
				<Card.Footer class="border-t px-6 py-4 items-end">
					<Button disabled={editOrganizationAddress.pending > 0} type="submit"
						>{$_('common.save')}</Button
					>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</form>
<form class="space-y-12" {...editOrganizationDetails.enhance(({ submit }) => submit())}>
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
				<Card.Content class="pt-6 space-y-3">
					<Field.Group>
						<Field.Field>
							<Field.Label for="tel-input">
								{$_('user-pages.organizations.createOrganization.labels.organizationPhone')}
							</Field.Label>
							<PhoneInput
								class="max-w-md"
								searchPlaceholder={$_(
									'user-pages.organizations.createOrganization.placeholders.phoneCountryCodeSearch'
								)}
								{...editOrganizationDetails.fields.organizationPhone.as('tel')}
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label for="organizationEmail">
								{$_('user-pages.organizations.createOrganization.labels.organizationEmail')}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationDetails.fields.organizationEmail.as('email')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationEmail'
								)}
								id="organizationEmail"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label for="organizationWebsite">
								{$_('user-pages.organizations.createOrganization.labels.organizationWebsite')}
							</Field.Label>
							<Input
								class="max-w-md"
								{...editOrganizationDetails.fields.organizationWebsite.as('url')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationWebsite'
								)}
								id="organizationWebsite"
							/>
						</Field.Field>
					</Field.Group>
				</Card.Content>
				<Card.Footer class="border-t px-6 py-4">
					<Button disabled={editOrganizationDetails.pending > 0} type="submit">
						{$_('common.save')}
					</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</form>
