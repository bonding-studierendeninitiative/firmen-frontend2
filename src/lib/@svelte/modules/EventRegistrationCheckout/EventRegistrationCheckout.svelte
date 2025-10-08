<script lang="ts">
	import { _, locale } from '@services';
	import { AddonList, LocalizedDate, Modal } from '@/@svelte/components';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { FilledCheckIcon } from '@/@svelte/icons';
	import { dayjs, number } from '@services/i18n';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import * as Tabs from '@/components/ui/tabs';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';
	import { goto } from '$app/navigation';
	import SuperDebug from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { type GetBuyOptionResponse } from '@schema';
	import { CalendarDays, Check } from '@lucide/svelte';
	import type { InferOutput } from 'valibot';
	import { registerOrganizationToEvent } from '@/remote/functions';

	interface Props {
		addonPackages: any;
		orgSlug: string;
		event: any;
		buyOption: InferOutput<GetBuyOptionResponse>;
	}

	let { addonPackages, orgSlug, event, buyOption }: Props = $props();

	let isOpen = $state(false);

	let billingEqualCompany = $state(false);

	$effect(() => {
		if (billingEqualCompany) {
			syncBillingAddress();
		}
	});

	function syncBillingAddress() {
		const {
			billingOrganizationName,
			billingStreet,
			billingZipCode,
			billingCity,
			billingCountry,
			contractLegalEntityName,
			contractAddressStreet,
			contractAddressZipCode,
			contractAddressCity,
			contractAddressCountry
		} = registerOrganizationToEvent.fields;
		billingOrganizationName.set(contractLegalEntityName.value());
		billingStreet.set(contractAddressStreet.value());
		billingZipCode.set(contractAddressZipCode.value());
		billingCity.set(contractAddressCity.value());
		billingCountry.set(contractAddressCountry.value());
	}

	function getPackagePrice(id?: string | null) {
		const pkg = buyOption?.packages.find((pkg) => pkg.id === id);

		if (registerOrganizationToEvent.fields.selectedAmountOfParticipationDays.value() > 1) {
			const extraDays =
				registerOrganizationToEvent.fields.selectedAmountOfParticipationDays.value() - 1;
			const cheapestPackage = buyOption?.packages
				.filter((pkg) => Boolean(pkg.price))
				.sort((a, b) => Number(a.price) - Number(b.price))[0];
			return pkg ? Number(pkg.price) + extraDays * Number(cheapestPackage?.price) : 0;
		} else {
			return pkg ? Number(pkg.price) : 0;
		}
	}

	function getSelectedAddonPackagesPrice(
		addonPackagesList: {
			id: string;
			price: number | null;
			addons: {
				id?: string | null | undefined;
				price?: number | undefined;
			}[];
		}[],
		selectedAddonPackages: string[],
		selectedAddons: string[]
	) {
		return addonPackagesList.reduce((sum, addonPackage) => {
			if (selectedAddonPackages.includes(addonPackage.id)) {
				sum += Number(addonPackage.price);
			} else {
				addonPackage.addons.forEach((addon) => {
					if (addon && addon.id && selectedAddons.includes(addon.id) && addon.price) {
						sum += addon.price;
					}
				});
			}
			return sum;
		}, 0);
	}

	let selectedPackagePrice = $derived(
		getPackagePrice(registerOrganizationToEvent.fields.packageId.value()) as number
	);
	let selectedAddonPrice = $derived(
		getSelectedAddonPackagesPrice(
			addonPackages ?? [],
			registerOrganizationToEvent.fields.selectedAddonPackages.value() ?? [],
			registerOrganizationToEvent.fields.selectedAddons.value() ?? []
		) as number
	);

	let termsAccepted = $state(false);
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
		<Button variant="gradient" class="py-1.5!" onclick={() => goto(`/${orgSlug}/events`)}>
			{$_('common.viewEvents')}
		</Button>
	</footer>
</Modal>
<div class="mb-10">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Item>
					<a href={`/${orgSlug}/events`}>{$_('user-pages.events.events')}</a>
				</Breadcrumb.Item>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Item>
					<a href={`/${orgSlug}/events/${event?.id}`}>{event?.name}</a>
				</Breadcrumb.Item>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>{$_('user-pages.events.event-registration.registration')}</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
<div class="max-w-(--breakpoint-lg) mx-auto">
	<div class=" flex justify-between items-start">
		<h3 class=" text-xl font-extrabold text-stone-800">
			{$_('user-pages.events.registrationForm')}
		</h3>
		<!--<button>
			<CrossIcon />
		</button>-->
	</div>
	<div class=" my-6">
		<hr />
	</div>

	<div class=" grid grid-cols-1 gap-4">
		<form
			{...registerOrganizationToEvent.enhance(async ({ submit }) => {
				try {
					await submit();
				} catch (e) {
					console.error(e);
					// @ts-expect-error
					toast.error(e?.body?.message);
				}
			})}
			id="create-event-registration-form"
		>
			<h4 class=" font-extrabold text-sm text-stone-900 mb-6">
				{$_('user-pages.events.event-registration.companyInformation')}
			</h4>
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.contractLegalEntityName')}</Label>
				<Input
					{...registerOrganizationToEvent.fields.contractLegalEntityName.as('text')}
					placeholder={$_(
						'user-pages.events.event-registration.placeholders.contractLegalEntityName'
					)}
				/>
			</div>
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.contractAddressStreet')}</Label>
				<Input
					{...registerOrganizationToEvent.fields.contractAddressStreet.as('text')}
					placeholder={$_(
						'user-pages.events.event-registration.placeholders.contractAddressStreet'
					)}
				/>
			</div>

			<div class="flex gap-4">
				<div class="max-w-2xl">
					<div class="mt-1">
						<Label>{$_('user-pages.events.event-registration.labels.contractAddressZipCode')}</Label
						>
						<Input
							{...registerOrganizationToEvent.fields.contractAddressZipCode.as('text')}
							placeholder={$_(
								'user-pages.events.event-registration.placeholders.contractAddressZipCode'
							)}
						/>
					</div>
				</div>
				<div class="grow">
					<div class="mt-1">
						<Label>{$_('user-pages.events.event-registration.labels.contractAddressCity')}</Label>
						<Input
							{...registerOrganizationToEvent.fields.contractAddressCity.as('text')}
							placeholder={$_(
								'user-pages.events.event-registration.placeholders.contractAddressCity'
							)}
						/>
					</div>
				</div>
			</div>
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.contractAddressCountry')}</Label>
				<Input
					{...registerOrganizationToEvent.fields.contractAddressCountry.as('text')}
					placeholder={$_(
						'user-pages.events.event-registration.placeholders.contractAddressCountry'
					)}
				/>
			</div>

			<h4 class=" font-extrabold text-sm text-stone-900 mt-10 mb-6">
				{$_('user-pages.events.event-registration.billingInformation')}
			</h4>
			<div class="flex items-center space-x-2 mb-4">
				<Checkbox
					id="billingAddress"
					aria-labelledby="terms-label"
					bind:checked={billingEqualCompany}
				/>
				<Label
					id="billingAddress-label"
					for="billingAddress"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{$_('user-pages.events.event-registration.billingEqualCompany')}
				</Label>
			</div>
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.billingOrganizationName')}</Label>
				<Input
					disabled={billingEqualCompany}
					{...registerOrganizationToEvent.fields.billingOrganizationName.as('text')}
					placeholder={$_(
						'user-pages.events.event-registration.placeholders.billingOrganizationName'
					)}
				/>
			</div>

			<div>
				<Label>{$_('user-pages.events.event-registration.labels.billingStreet')}</Label>
				<Input
					disabled={billingEqualCompany}
					{...registerOrganizationToEvent.fields.billingStreet.as('text')}
					placeholder={$_('user-pages.events.event-registration.placeholders.billingStreet')}
				/>
			</div>

			<div class="flex gap-4">
				<div class="max-w-2xl">
					<div class="mt-1">
						<div>
							<Label>{$_('user-pages.events.event-registration.labels.billingZipCode')}</Label>
							<Input
								disabled={billingEqualCompany}
								{...registerOrganizationToEvent.fields.billingZipCode.as('text')}
								placeholder={$_('user-pages.events.event-registration.placeholders.billingZipCode')}
							/>
						</div>
					</div>
				</div>
				<div class="grow">
					<div class="mt-1">
						<div>
							<Label>{$_('user-pages.events.event-registration.labels.billingCity')}</Label>
							<Input
								disabled={billingEqualCompany}
								{...registerOrganizationToEvent.fields.billingCity.as('text')}
								placeholder={$_('user-pages.events.event-registration.placeholders.billingCity')}
							/>
						</div>
					</div>
				</div>
			</div>
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.billingCountry')}</Label>
				<Input
					disabled={billingEqualCompany}
					{...registerOrganizationToEvent.fields.billingCountry.as('text')}
					placeholder={$_('user-pages.events.event-registration.placeholders.billingCountry')}
				/>
			</div>

			<hr class="my-8" />
			<div>
				<Label>{$_('user-pages.events.event-registration.labels.billingVat')}</Label>
				<Input
					{...registerOrganizationToEvent.fields.billingVat.as('text')}
					placeholder={$_('user-pages.events.event-registration.placeholders.billingVat')}
				/>
			</div>

			<div>
				<Label>{$_('user-pages.events.event-registration.labels.billingReference')}</Label>
				<Input
					{...registerOrganizationToEvent.fields.billingReference.as('text')}
					placeholder={''}
				/>
			</div>
		</form>
	</div>
	{#if Number(buyOption?.allowedSignUpDays) > 1}
		<section class=" my-10">
			<h4 class=" font-extrabold text-sm text-stone-900">
				{$_('user-pages.events.sign-up-days.header')}
			</h4>
			<p class=" mt-2 text-stone-500 font-normal text-sm">
				{$_('user-pages.events.sign-up-days.description')}
			</p>
			<div class="my-4">
				<Tabs.Root
					bind:value={
						() =>
							registerOrganizationToEvent.fields.selectedAmountOfParticipationDays
								.value()
								.toString(),
						(a) =>
							registerOrganizationToEvent.fields.selectedAmountOfParticipationDays.set(Number(a))
					}
				>
					<Tabs.List>
						{#each Array.from(Array(buyOption?.allowedSignUpDays).keys()) as dayIndex}
							<Tabs.Trigger value={(dayIndex + 1).toString()}
								>{$_('user-pages.events.sign-up-days.days', {
									values: { days: (dayIndex + 1).toString() }
								})}</Tabs.Trigger
							>
						{/each}
					</Tabs.List>
				</Tabs.Root>
			</div>
		</section>
	{/if}
	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('user-pages.events.eventDays')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.eventDaysDescription')}
		</p>
		<div class=" @container/event-days flex justify-between my-4">
			<ToggleGroup.Root
				type="multiple"
				bind:value={
					registerOrganizationToEvent.fields.selectedEventDays.value,
					registerOrganizationToEvent.fields.selectedEventDays.set
				}
				class="grid grid-cols-1 @xl/event-days:grid-cols-2 @3xl/event-days:grid-cols-3 gap-4"
			>
				{#each buyOption?.eventDays as day}
					{@const dayjsData = dayjs(day.dayDate, { locale: $locale ?? 'de-DE' })}
					{@const dayName = dayjsData.format('dddd')}
					<Label
						for={day.dayDate}
						class="border-muted bg-popover cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=on])]:border-primary [&:has([disabled])]:cursor-not-allowed rounded-md border-2 p-4"
					>
						<ToggleGroup.Item
							disabled={day.remainingCapacity < 1}
							value={day.dayDate}
							id={day.dayDate}
							class="sr-only"
							aria-label={dayName}
						/>
						<div class="flex justify-between items-start gap-2">
							<div>
								<div class="flex items-center gap-2 mb-2">
									<CalendarDays class="size-5 text-muted-foreground" />
									<LocalizedDate
										date={day.dayDate}
										format="LL"
										class="font-medium text-lg text-nowrap"
									/>
								</div>
								<LocalizedDate
									date={day.dayDate}
									format="dddd"
									class="text-muted-foreground text-nowrap"
								/>
							</div>
							{#if registerOrganizationToEvent.fields.selectedEventDays
								.value()
								.includes(day.dayDate)}
								<div
									class="size-6 rounded-full bg-primary shrink-0 grow-0 flex items-center justify-center"
								>
									<Check class="size-4 text-primary-foreground" />
								</div>
							{/if}
						</div>
					</Label>
				{/each}
			</ToggleGroup.Root>
		</div>
	</section>

	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('common.packages')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.packageDescription')}
		</p>

		<div class=" border border-stone-200 w-full rounded-lg mt-6">
			<RadioGroup.Root
				bind:value={
					registerOrganizationToEvent.fields.packageId.value,
					registerOrganizationToEvent.fields.packageId.set
				}
			>
				{#each buyOption?.packages ?? [] as pkg}
					<Label
						for={`package-${pkg.id}`}
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
							<div class="flex items-center gap-2">
								<RadioGroup.Item value={pkg.id} id={`package-${pkg.id}`} />
								<span>
									{pkg.name}
								</span>
							</div>
							<span class="text-stone-800 font-extrabold">
								{$number((pkg.price ?? 0) / 100, {
									style: 'currency',
									currency: 'EUR',
									currencyDisplay: 'code'
								})}
							</span>
						</div>
					</Label>
				{/each}
			</RadioGroup.Root>
		</div>
	</section>

	<section>
		<h4 class=" font-extrabold text-sm text-stone-900">
			{$_('user-pages.events.additionalMarketingServices')}
		</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.additionalMarketingServicesDescription')}
		</p>
		<AddonList
			addons={addonPackages}
			bind:selectedAddons={
				registerOrganizationToEvent.fields.selectedAddons.value,
				registerOrganizationToEvent.fields.selectedAddons.set
			}
			bind:selectedAddonPackages={
				registerOrganizationToEvent.fields.selectedAddonPackages.value,
				registerOrganizationToEvent.fields.selectedAddonPackages.set
			}
		/>
	</section>
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
			<p class="text-sm font-extrabold text-stone-800">
				{$number(selectedPackagePrice / 100, {
					style: 'currency',
					currency: 'EUR',
					currencyDisplay: 'code'
				})}
			</p>
		</div>
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-medium text-stone-800">
				{$_('user-pages.events.additionalMarketingServices')}
			</p>
			<p class="text-sm font-extrabold text-stone-800">
				{$number((selectedAddonPrice ?? 0) / 100, {
					style: 'currency',
					currency: 'EUR',
					currencyDisplay: 'code'
				})}
			</p>
		</div>
		<div class=" my-4">
			<hr />
		</div>
		<div class="flex items-center justify-between mb-6">
			<p class="text-sm font-medium text-stone-800">{$_('user-pages.events.total')}</p>
			<p class="text-sm font-extrabold text-stone-800">
				{$number(((selectedAddonPrice ?? 0) + (selectedPackagePrice ?? 0)) / 100, {
					style: 'currency',
					currency: 'EUR',
					currencyDisplay: 'code'
				})}
			</p>
		</div>
		<div class="flex items-center justify-end space-x-2 w-full">
			<Label
				id="terms-label"
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				<div class="undertaking-text">
					{@html $_('user-pages.events.undertakingText')}
				</div>
			</Label>
			<Checkbox bind:checked={termsAccepted} id="terms" aria-labelledby="terms-label" />
		</div>
	</section>
	<footer class=" flex mt-6 justify-end items-center">
		<Button
			form="create-event-registration-form"
			disabled={!termsAccepted || registerOrganizationToEvent.fields.packageId.value() === ''}
			variant="gradient"
			type="submit">{$_('common.submit')}</Button
		>
	</footer>

	<SuperDebug data={registerOrganizationToEvent.fields.value()} />
</div>
