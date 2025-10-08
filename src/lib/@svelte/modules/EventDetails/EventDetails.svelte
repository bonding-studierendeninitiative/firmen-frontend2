<script lang="ts">
	import { _, dayjs } from '@services';
	import { Button } from '@/components/ui/button';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import { CalenderIcon, LocationIcon } from '@/@svelte/icons';
	import { AddonList, LocalizedDate, LocalizedDateRange } from '@/@svelte/components';
	import { BuyOptionPreview } from '@/@svelte/modules';

	let selectedAddons: string[] = $state([]);
	let selectedAddonPackages: string[] = $state([]);
	let selectedPackageId: string = $state('');
	let selectedAmountOfParticipationDays: string = $state('1');
	let selectedEventDays: string[] = $state([]);
	interface Props {
		event: any;
		buyOption: any;
		orgSlug?: string;
	}

	let { event, buyOption, orgSlug = '' }: Props = $props();

	let searchParams = $derived(
		new URLSearchParams([
			...selectedAddons.map((addon) => ['selectedAddon', addon]),
			...selectedAddonPackages.map((addonPackage) => ['selectedAddonPackage', addonPackage]),
			...(selectedPackageId ? [['selectedPackage', selectedPackageId]] : []),
			...selectedEventDays.map((eventDay) => ['selectedEventDays', eventDay]),
			...(selectedAmountOfParticipationDays
				? [['selectedAmountOfParticipationDays', selectedAmountOfParticipationDays]]
				: [])
		])
	);

	const showCapacity = false;

	function canProceed() {
		return selectedPackageId !== '' && selectedEventDays.length > 0;
	}
</script>

<div class="mb-10">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={`/${orgSlug}/events`}>
					{$_('user-pages.events.events')}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>{event?.name}</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
<div class="max-w-(--breakpoint-lg) mx-auto">
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{event?.name}</h4>
				<div class=" flex mt-2">
					<div class=" flex items-center mr-2">
						<CalenderIcon />
						{#if event?.dateTo && dayjs(event?.dateFrom) !== dayjs(event?.dateTo)}
							<LocalizedDateRange
								class=" ml-2 text-sm text-stone-800 font-medium"
								format="short"
								hoverFormat="none"
								dateFrom={event?.dateFrom}
								dateTo={event?.dateTo}
							/>
						{:else}
							<LocalizedDate
								class=" ml-2 text-sm text-stone-800 font-medium"
								format="short"
								hoverFormat="none"
								date={event?.dateFrom}
							/>
						{/if}
					</div>
					<div class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{event?.location}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class=" my-10">
		<hr />
	</div>
	<section>
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('user-pages.events.overview')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{event?.descriptionNotes}
		</p>
	</section>
	<div class=" my-10">
		<hr />
	</div>
	<BuyOptionPreview
		{buyOption}
		bind:selectedPackageId
		bind:selectedAmountOfParticipationDays
		bind:selectedEventDays
	/>

	{#if buyOption.addonPackages.length > 0}
		<section>
			<h4 class=" font-extrabold text-sm text-stone-900">
				{$_('user-pages.events.additionalMarketingServices')}
			</h4>
			<p class=" mt-2 text-stone-500 font-normal text-sm">
				{$_('user-pages.events.additionalMarketingServicesDescription')}
			</p>
			<AddonList addons={buyOption.addonPackages} bind:selectedAddonPackages bind:selectedAddons />
		</section>
	{/if}
	<footer class=" flex mt-6 justify-end items-center">
		{#if canProceed()}
			<Button href={`checkout?${searchParams}`}>{$_('common.continue')}</Button>
		{:else}
			<Button disabled={true}>{$_('common.continue')}</Button>
		{/if}
	</footer>
</div>
