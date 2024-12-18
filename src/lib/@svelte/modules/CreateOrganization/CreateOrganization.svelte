<script lang="ts">
	import { Drawer, Modal } from '$lib/@svelte/components';
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import { Button } from '@/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	import { PhoneInput } from '$lib/@svelte/components/PhoneInput';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { CreateOrganizationRequestSchema, type CreateOrganizationRequest } from '@schema';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { toast } from 'svelte-french-toast';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';

	export let validated: SuperValidated<CreateOrganizationRequest>;
	export let revocable = true;
	export let isOpen = false;

	const superform = superForm<CreateOrganizationRequest>(validated, {
		validators: valibot(CreateOrganizationRequestSchema),
		applyAction: true,
		dataType: 'json',
		invalidateAll: 'force',
		onResult({ result }) {

			if (result.type === 'success' || result.type=== "redirect") {
				toast.success($_('user-pages.organizations.createOrganization.successCreated'));
				isOpen = false;
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});

	const { form: formData, enhance, constraints } = superform;
	$: selectedType = undefined;

</script>

<form action="/create-org?/createOrg" method="POST" id="create-org-form" use:enhance>
	<div class=" flex flex-col gap-1">
		<Field form={superform} name="name">
			<Control let:attrs>
				<Label
				>{$_('user-pages.organizations.createOrganization.labels.organizationName')}</Label
				>

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
		<Field form={superform} name="type">
			<Control let:attrs>
				<Label
				>{$_('user-pages.organizations.createOrganization.labels.organizationType')}</Label
				>

				<Select.Root
					selected={selectedType}
					onSelectedChange={(v) => {
								v && ($formData.type = v.value);
								selectedType = v;
							}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value
							placeholder={$_(
										'user-pages.organizations.createOrganization.placeholders.organizationType'
									)}
						/>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="company" label={$_("common.org-types.company")} />
						<Select.Item value="nonprofit" label={$_("common.org-types.nonprofit")} />
						<Select.Item value="other" label={$_("common.org-types.other")} />
					</Select.Content>
				</Select.Root>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="phone">
			<Control let:attrs>
				<Label
				>{$_('user-pages.organizations.createOrganization.labels.organizationPhone')}</Label
				>
				<PhoneInput
					bind:selectedCountry={$formData.countryCode}
					searchPlaceholder={$_(
								'user-pages.organizations.createOrganization.placeholders.phoneCountryCodeSearch'
							)}
					bind:value={$formData.phone}
					{...attrs}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="email">
			<Control let:attrs>
				<Label
				>{$_('user-pages.organizations.createOrganization.labels.organizationEmail')}</Label
				>
				<Input
					{...attrs}
					bind:value={$formData.email}
					placeholder={$_(
								'user-pages.organizations.createOrganization.placeholders.organizationEmail'
							)}
				/>
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="streetAddress">
			<Control let:attrs>
				<Label
				>{$_(
					'user-pages.organizations.createOrganization.labels.organizationStreetAddress'
				)}</Label
				>
				<Input
					{...attrs}
					bind:value={$formData.streetAddress}
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
					bind:value={$formData.extendedAddress}
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
								bind:value={$formData.zipCode}
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
								bind:value={$formData.locality}
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
		<!--

		<Select
			name="organization-type"
			label={$_('user-pages.organizations.createOrganization.labels.organizationType')}
			placeholder={$_(
				'user-pages.organizations.createOrganization.placeholders.organizationType'
			)}
			items={[
				{ label: 'Company', value: 'company' },
				{ label: 'Non-Profit', value: 'nonprofit' },
				{ label: 'Other', value: 'other' }
			]}
			bind:value={$form.type}
			{...$constraints.type}
		></Select>


		<div class="flex gap-4">
			<div class="max-w-28">
				<div class="mt-1">
					<Input
						name="organization-zip-code"
						label={$_('user-pages.organizations.createOrganization.labels.organizationZipCode')}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationZipCode'
						)}
						bind:value={$form.zipCode}
						{...$constraints.zipCode}
					/>
				</div>
			</div>
			<div class="flex-grow">
				<div class="mt-1">
					<Input
						name="organization-locality"
						label={$_(
							'user-pages.organizations.createOrganization.labels.organizationLocality'
						)}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationLocality'
						)}
						bind:value={$form.locality}
						{...$constraints.locality}
					/>
				</div>
			</div>

		</div>
		-->
		<footer>
			<footer class=" flex justify-end items-center w-full">
				{#if revocable}
					<Button variant="secondary" classes="mr-2" on:click={() => (isOpen = false)}>{$_('common.cancel')}</Button>
				{/if}
				<Button form="create-org-form" type="submit">{$_('common.save')}</Button>
			</footer>
		</footer>
	</div>
</form>
