<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { PhoneInput } from '@/@svelte/components/PhoneInput';
	import { _ } from '@services';
	import * as Card from '@/components/ui/card';
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
				<Card.Content class="pt-6 space-y-3">
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationName')}
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.entityName.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationName'
								)}
							/>
							{#each editOrganizationAddress.fields.entityName.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Label>
					</div>
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationStreetAddress')}
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.street.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationStreetAddress'
								)}
							/>
							{#each editOrganizationAddress.fields.street.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Label>
					</div>
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationExtendedAddress')}
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.extendedAddress.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationExtendedAddress'
								)}
							/>
							{#each editOrganizationAddress.fields.extendedAddress.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Label>
					</div>

					<div class="flex gap-4">
						<div class="max-w-28">
							<div class="mt-1">
								<Label>
									{$_('user-pages.organizations.createOrganization.labels.organizationZipCode')}
									<Input
										{...editOrganizationAddress.fields.zipCode.as('text')}
										placeholder={$_(
											'user-pages.organizations.createOrganization.placeholders.organizationZipCode'
										)}
									/>
									{#each editOrganizationAddress.fields.zipCode.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Label>
							</div>
						</div>
						<div class="grow">
							<div class="mt-1">
								<Label>
									{$_('user-pages.organizations.createOrganization.labels.organizationLocality')}
									<Input
										class="max-w-xs"
										{...editOrganizationAddress.fields.locality.as('text')}
										placeholder={$_(
											'user-pages.organizations.createOrganization.placeholders.organizationLocality'
										)}
									/>
									{#each editOrganizationAddress.fields.locality.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Label>
							</div>
						</div>
					</div>
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationCountry')}
							<Input
								class="max-w-md"
								{...editOrganizationAddress.fields.country.as('text')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationCountry'
								)}
							/>
							{#each editOrganizationAddress.fields.country.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Label>
					</div>
				</Card.Content>
				<Card.Footer class="border-t px-6 py-4">
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
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationPhone')}
							<PhoneInput
								class="max-w-md"
								searchPlaceholder={$_(
									'user-pages.organizations.createOrganization.placeholders.phoneCountryCodeSearch'
								)}
								{...editOrganizationDetails.fields.organizationPhone.as('tel')}
							/>
						</Label>
					</div>
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationEmail')}
							<Input
								class="max-w-md"
								{...editOrganizationDetails.fields.organizationEmail.as('email')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationEmail'
								)}
							/>
						</Label>
					</div>
					<div>
						<Label>
							{$_('user-pages.organizations.createOrganization.labels.organizationWebsite')}
							<Input
								class="max-w-md"
								{...editOrganizationDetails.fields.organizationWebsite.as('url')}
								placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationWebsite'
								)}
							/>
						</Label>
					</div>
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
