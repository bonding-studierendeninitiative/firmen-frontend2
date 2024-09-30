<script lang="ts">
	import { _ } from '@services';
	import { Modal, Input, Select, Checkbox, Chip } from '$lib/@svelte/components';
	import { Modal, Select, Chip } from '$lib/@svelte/components';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import Dropzone from 'svelte-file-dropzone';
	import { DropzoneIcon, CrossIcon, FilledCheckIcon } from '$lib/@svelte/icons';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { number } from '@services/i18n';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Control, Description, Field, FieldErrors } from '@/components/ui/form';
	import { goto } from '$app/navigation';
	import type {
		PageData
	} from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { type SetOrgDetailsRequest, SetOrgDetailsRequestSchema } from '@schema';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import type { CreateEventRegistration } from '@/services';
	import AddonList from '@/@svelte/components/AddonList/AddonList.svelte';
	import { t } from 'svelte-i18n';
	import { Button } from '@/components/ui/button';
	export let data: PageData;
	const addons = data.addons ?? [];

	const superform = superForm<CreateEventRegistration>(data.createEventRegistrationForm, {
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


	let isOpen = false;

	let files: any = {
		accepted: [],
		rejected: []
	};

	let billingEqualCompany = false;
	$: if (billingEqualCompany) $formData.billingOrganizationName = $formData.contractLegalEntityName;
	$: if (billingEqualCompany) $formData.billingStreet = $formData.contractAddressStreet;
	$: if (billingEqualCompany) $formData.billingZipCode = $formData.contractAddressZipCode;
	$: if (billingEqualCompany) $formData.billingCity = $formData.contractAddressCity;
	$: if (billingEqualCompany) $formData.billingCountry = $formData.billingCountry;

	function handlePackageSelect(v: boolean, pkgID: string) {
		if (v) {
			data.selectedPackage = pkgID;
		} else {
			if (data.selectedPackage === pkgID) {
				data.selectedPackage = '';
			}
		}
	}

	function getPackagePrice(id: string) {
		const pkg = data.buyOption.packages.find(pkg => pkg.id === id);
		return pkg ? pkg.price : '';
	}

	function getSelectedAddonsPrice(addonsList, selectedAddons) {

		return selectedAddons.reduce((sum, addonId) => {
			for (let item of addonsList) {
				if (item.id === addonId) {
					sum += item.price;
				}
				for (let addon of item.addons) {
					if (addon.id === addonId) {
						sum += addon.price;
					}
				}
			}
			return sum;
		}, 0);
	}

	$: selectedPackagePrice = getPackagePrice(data.selectedPackage);
	$: selectedAddonPrice = getSelectedAddonsPrice(data.addons, data.selectedAddons);

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	const handleFormSubmit = () => {
		isOpen = true;
	};
	let termsAccepted = false;

</script>

<Modal bind:isOpen>

	<div class=" flex flex-col justify-center items-center">
		<p class=" text-xl">
			<FilledCheckIcon />
		</p>
		<div class=" my-6 text-center">
			<h2 class=" text-stone-950 font-extrabold text-base">
				{$_('user-pages.events.registrationCompleted')}
			</h2>
			<p class="mt-2 text-stone-500 text-base">
				{$_('user-pages.events.registrationCompletedDescription')}
			</p>
		</div>
	</div>
	<footer class=" flex items-center justify-center">
		<Button variant="gradient" class="!py-1.5" on:click={() => goto('/events')}>
			{$_('common.viewEvents')}
		</Button>
	</footer>
</Modal>
<div>
	<div class="mb-10">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Item let:attrs>
						<a href={`/${data.orgSlug}/events`} {...attrs}>{$_('user-pages.events.events')}</a>
					</Breadcrumb.Item>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Item let:attrs>
						<a href={`/${data.orgSlug}/events/${data.event.id}`} {...attrs}>{data.event.name}</a>
					</Breadcrumb.Item>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{$_('user-pages.events.event-registration.registration')}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
	<div class=" flex justify-between items-start">
		<h3 class=" text-xl font-extrabold text-stone-800">
			{$_('user-pages.events.registrationForm')}
		</h3>
		<button>
			<CrossIcon />
		</button>
	</div>
	<div class=" my-6">
		<hr />
	</div>

	<div class=" grid grid-cols-1 gap-4">

		<form action="?/createEventRegistration" method="post" use:enhance>
			<h4 class=" font-extrabold text-sm text-stone-900 mb-6">
				{$_('user-pages.events.event-registration.companyInformation')}
			</h4>
			<Field form={superform} name="contractLegalEntityName">
				<Control let:attrs>
					<Label
					>{$_('user-pages.events.event-registration.labels.contractLegalEntityName')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.contractLegalEntityName}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.contractLegalEntityName'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="contractAddressStreet">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.contractAddressStreet')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.contractAddressStreet}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.contractAddressStreet'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<div class="flex gap-4">
				<div class="max-w-2xl">
					<div class="mt-1">
						<Field form={superform} name="contractAddressZipCode">
							<Control let:attrs>
								<Label
								>{$_(
									'user-pages.events.event-registration.labels.contractAddressZipCode'
								)}</Label
								>
								<Input
									{...attrs}
									bind:value={$formData.contractAddressZipCode}
									placeholder={$_(
											'user-pages.events.event-registration.placeholders.contractAddressZipCode'
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
						<Field form={superform} name="contractAddressCity">
							<Control let:attrs>
								<Label
								>{$_(
									'user-pages.events.event-registration.labels.contractAddressCity'
								)}</Label
								>
								<Input
									{...attrs}
									bind:value={$formData.contractAddressCity}
									placeholder={$_(
											'user-pages.events.event-registration.placeholders.contractAddressCity'
										)}
								/>
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</div>
				</div>
			</div>
			<Field form={superform} name="contractAddressCountry">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.contractAddressCountry')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.contractAddressStreet}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.contractAddressCountry'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>


			<h4 class=" font-extrabold text-sm text-stone-900 mt-10 mb-6">
				{$_('user-pages.events.event-registration.billingInformation')}
			</h4>
			<div class="flex items-center space-x-2 mb-4">
				<Checkbox id="billingAddress" aria-labelledby="terms-label" bind:checked={billingEqualCompany} />
				<Label
					id="billingAddress-label"
					for="billingAddress"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{$_('user-pages.events.event-registration.billingEqualCompany')}
				</Label>
			</div>
			<Field form={superform} name="billingOrganizationName">
				<Control let:attrs>
					<Label
					>{$_('user-pages.events.event-registration.labels.billingOrganizationName')}</Label
					>
					<Input
						disabled={billingEqualCompany}
						{...attrs}
						bind:value={$formData.billingOrganizationName}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.billingOrganizationName'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="billingStreet">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.billingStreet')}</Label
					>
					<Input
						disabled={billingEqualCompany}
						{...attrs}
						bind:value={$formData.billingStreet}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.billingStreet'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<div class="flex gap-4">
				<div class="max-w-2xl">
					<div class="mt-1">
						<Field form={superform} name="billingZipCode">
							<Control let:attrs>
								<Label
								>{$_(
									'user-pages.events.event-registration.labels.billingZipCode'
								)}</Label
								>
								<Input
									disabled={billingEqualCompany}
									{...attrs}
									bind:value={$formData.billingZipCode}
									placeholder={$_(
											'user-pages.events.event-registration.placeholders.billingZipCode'
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
						<Field form={superform} name="billingCity">
							<Control let:attrs>
								<Label
								>{$_(
									'user-pages.events.event-registration.labels.billingCity'
								)}</Label
								>
								<Input
									disabled={billingEqualCompany}
									{...attrs}
									bind:value={$formData.billingCity}
									placeholder={$_(
											'user-pages.events.event-registration.placeholders.billingCity'
										)}
								/>
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</div>
				</div>
			</div>
			<Field form={superform} name="billingCountry">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.billingCountry')}</Label
					>
					<Input
						disabled={billingEqualCompany}
						{...attrs}
						bind:value={$formData.billingCountry}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.billingCountry'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="billingVat">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.billingVat')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.billingVat}
						placeholder={$_(
								'user-pages.events.event-registration.placeholders.billingVat'
							)}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
			<Field form={superform} name="billingReference">
				<Control let:attrs>
					<Label
					>{$_(
						'user-pages.events.event-registration.labels.billingReference')}</Label
					>
					<Input
						{...attrs}
						bind:value={$formData.billingReference}
						placeholder={""}
					/>
				</Control>
				<Description />
				<FieldErrors />
			</Field>
		</form>

	</div>

	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('common.packages')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.packageDescription')}
		</p>

		<div class=" border border-stone-200 w-full rounded-lg mt-6">
			{#each data.buyOption.packages as pkg}
				<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
					<div class="flex items-center space-x-2">
						<Checkbox id={`package-${pkg.id}`} checked={data.selectedPackage === pkg.id}
											onCheckedChange={(v) => handlePackageSelect(v, pkg.id)} />
						<Label
							for={`package-${pkg.id}`}
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{pkg.name}
						</Label>
					</div>
					<p class=" text-sm font-stone-800 font-extrabold">{$number((pkg.price ?? 0) / 100, {
						style: "currency",
						currency: "EUR",
						currencyDisplay: "code"
					})}</p>
				</div>
			{/each}


		</div>
	</section>

	<AddonList {addons} bind:selectedAddons={data.selectedAddons} />
	<!--
	<section class=" my-6">
		<Dropzone
			disableDefaultStyles
			containerClasses="border border-gray-300 py-4 bg-gray-50"
			on:drop={handleFilesSelect}
		>
			<div class=" flex justify-center items-center flex-col">
				<DropzoneIcon />
				<p class="mt-5 text-base text-opacity-85 text-black font-medium">
					{$_('user-pages.events.dragAndDropHeading')}
				</p>
				<p class="text-black text-sm text-opacity-45 font-normal">
					{$_('user-pages.events.dragAndDropText')}
				</p>
			</div>
		</Dropzone
		>
	</section>
	-->
	<section class="my-6">
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-medium text-stone-800">{$_('user-pages.events.eventFee')}</p>
			<p class="text-sm font-extrabold text-stone-800">{$number((selectedPackagePrice ?? 0) / 100, {
				style: "currency",
				currency: "EUR",
				currencyDisplay: "code"
			})}</p>
		</div>
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-medium text-stone-800">{$_('user-pages.events.additionalMarketingServices')}</p>
			<p class="text-sm font-extrabold text-stone-800">{$number((selectedAddonPrice ?? 0) / 100, {
				style: "currency",
				currency: "EUR",
				currencyDisplay: "code"
			})}</p>
		</div>
		<div class=" my-4">
			<hr />
		</div>
		<div class="flex items-center justify-between mb-6">
			<p class="text-sm font-medium text-stone-800">{$_('user-pages.events.total')}</p>
			<p class="text-sm font-extrabold text-stone-800">{$number(((selectedPackagePrice + selectedAddonPrice) ?? 0) / 100, {
				style: "currency",
				currency: "EUR",
				currencyDisplay: "code"
			})}</p>
		</div>
		<div class="flex items-center justify-end space-x-2 w-full">

			<Label
				id="terms-label"
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				<div class="undertaking-text">
				{@html $_("user-pages.events.undertakingText")}
				</div>
			</Label>
			<Checkbox bind:checked={termsAccepted} id="terms" aria-labelledby="terms-label" />
		</div>
	</section>
	<footer class=" flex mt-6 justify-end items-center">
		<Button variant="gradient" on:click={handleFormSubmit}>{$_('common.submit')}</Button>
		<Button disabled={!termsAccepted || data.selectedPackage === ""} onClick={handleFormSubmit}>{$_('common.submit')}</Button>
	</footer>

</div>

<style>
    /* Scoped styling - it will only affect elements inside this component */
    :global(.undertaking-text a) {
        /* Example Tailwind-like styles */
        color: #3b82f6; /* equivalent to text-blue-500 */
        text-decoration: underline; /* underline */
    }

    :global(.undertaking-text a:hover) {
        color: #1e40af; /* equivalent to hover:text-blue-700 */
    }
</style>
