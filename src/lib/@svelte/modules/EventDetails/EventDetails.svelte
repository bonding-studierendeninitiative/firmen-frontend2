<script lang="ts">
	import { _, dayjs, locale } from '@services';
	import { Button } from '@/components/ui/button';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import * as Tabs from '@/components/ui/tabs';
	import * as Table from '@/components/ui/table';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import {
		OutlinedCheckIcon,
		OutlinedCrossIcon,
		CalenderIcon,
		LocationIcon
	} from '@/@svelte/icons';
	import { number } from '@services/i18n';
	import { AddonList, LocalizedDate } from '@/@svelte/components';
	import type { InferOutput } from 'valibot';
	import type { GetAddonPackageTemplateResponse } from '@schema';
	import { Label } from '@/components/ui/label';
	import { CalendarDays, Check, Users } from 'lucide-svelte';
	import { Progress } from '@/components/ui/progress';
	import { LocalizedDateRange } from '@/@svelte/components/LocalizedDateRange';

	export let event;
	export let buyOption;
	export let addons: InferOutput<GetAddonPackageTemplateResponse>[];
	let selectedAddons: string[] = [];
	let selectedAddonPackages: string[] = [];
	let selectedPackageId: string = '';
	let selectedAmountOfParticipationDays: string = '1';
	let selectedEventDays: string[] = [];
	export let orgSlug: string = '';

	$: searchParams = new URLSearchParams([
		...selectedAddons.map((addon) => ['selectedAddon', addon]),
		...selectedAddonPackages.map((addonPackage) => ['selectedAddonPackage', addonPackage]),
		...(selectedPackageId ? [['selectedPackage', selectedPackageId]] : []),
		...selectedEventDays.map((eventDay) => ['selectedEventDays', eventDay]),
		...(selectedAmountOfParticipationDays ? [['selectedAmountOfParticipationDays', selectedAmountOfParticipationDays]] : [])
	]);

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
<div class="max-w-screen-lg mx-auto">
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{event?.name}</h4>
				<div class=" flex mt-2">
					<div class=" flex items-center mr-2">
						<CalenderIcon />
						{#if event?.dateTo && dayjs(event?.dateFrom) !== dayjs(event?.dateTo)}
							<LocalizedDateRange class=" ml-2 text-sm text-stone-800 font-medium" format="short" hoverFormat="none"
																	dateFrom={event?.dateFrom} dateTo={event?.dateTo} />
						{:else}
							<LocalizedDate class=" ml-2 text-sm text-stone-800 font-medium" format="short" hoverFormat="none"
														 date={event?.dateFrom} />
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
	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('common.packages')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.packageOverview')}
		</p>
		<Table.Root class=" w-full mt-6 rounded-lg">
			<Table.Header>
				<Table.Row>
					<Table.Cell class={`w-1/${buyOption?.packages.length + 1}`}></Table.Cell>
					{#each buyOption?.packages as pkg}
						<Table.Cell class={`w-1/${buyOption?.packages.length + 1} p-3`}>
							<div>
								<p class=" text-brand text-sm font-medium">{pkg.name}</p>
								<p class=" font-extrabold text-2xl mt-2">
									{$number((pkg.price ?? 0) / 100, {
										style: 'currency',
										currency: 'EUR',
										currencyDisplay: 'code'
									})}
								</p>
							</div>
						</Table.Cell>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each buyOption?.services as service, index (index)}
					<Table.Row class="even:bg-stone-50">
						<Table.Cell class="  p-3 border border-stone-200 text-sm">{service.name}</Table.Cell>
						{#each buyOption?.packages as pkg}
							<Table.Cell
								class={selectedPackageId === pkg.id ? "p-3 border border-stone-200 bg-slate-300" : "p-3 border border-stone-200"}>
								<div class="flex justify-center items-center">
									{#if service.valueType === 'BOOLEAN'}
										{#if pkg.benefits[index].booleanValue}
											<OutlinedCheckIcon />
										{:else}
											<OutlinedCrossIcon />
										{/if}
									{/if}
									{#if service.valueType === 'INTEGER'}
										{pkg.benefits[index].numericValue}
									{/if}

									{#if service.valueType === 'STRING'}
										{pkg.benefits[index].stringValue}
									{/if}
								</div>
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
				<Table.Row>
					<Table.Cell></Table.Cell>
					{#each buyOption?.packages as pkg}
						<Table.Cell class=" p-3">
							<div class=" flex justify-center items-center">
								<Button on:click={() => selectedPackageId=pkg.id}
												variant={selectedPackageId === pkg.id? "default" : "outline"} class="!py-1.5 !px-4">
									{$_('common.select')}
								</Button>
							</div>
						</Table.Cell>
					{/each}
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</section>
	{#if buyOption?.allowedSignUpDays > 1}
		<section class=" my-10">
			<h4 class=" font-extrabold text-sm text-stone-900">{$_("user-pages.events.sign-up-days.header")}</h4>
			<p class=" mt-2 text-stone-500 font-normal text-sm">
				{$_('user-pages.events.sign-up-days.description')}
			</p>
			<div class="my-4">
				<Tabs.Root bind:value={selectedAmountOfParticipationDays}>
					<Tabs.List>
						{#each buyOption?.eventDays as _someDay, dayIndex}
							<Tabs.Trigger value={(dayIndex + 1).toString()}>{$_('user-pages.events.sign-up-days.days', {
								values: { days: (dayIndex + 1).toString() }
							})}</Tabs.Trigger>
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
			<ToggleGroup.Root type="multiple" bind:value={selectedEventDays}
												class="grid grid-cols-1 @xl/event-days:grid-cols-2 @3xl/event-days:grid-cols-3 gap-4">
				{#each buyOption?.eventDays as day}
					{@const dayjsData = dayjs(day.dayDate, { locale: $locale ?? "de-DE" })}
					{@const dayName = dayjsData.format("dddd")}
					<Label
						for={day.dayDate}
						class="border-muted bg-popover cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=on])]:border-primary [&:has([disabled])]:cursor-not-allowed rounded-md border-2 p-4">
						<ToggleGroup.Item disabled={day.remainingCapacity < 1} value={day.dayDate} id={day.dayDate}
															class="sr-only"
															aria-label={dayName} />
						<div class="flex justify-between items-start gap-2">
							<div>
								<div class="flex items-center gap-2 mb-2">
									<CalendarDays class="h-5 w-5 text-muted-foreground" />
									<LocalizedDate format="LL" hoverFormat="none" date={day.dayDate}
																 class="font-medium text-lg text-nowrap" />
								</div>
								<LocalizedDate format="dddd" hoverFormat="none" date={day.dayDate}
															 class="text-muted-foreground text-nowrap" />
							</div>
							{#if selectedEventDays.includes(day.dayDate)}
								<div
									class="h-6 w-6 rounded-full bg-primary flex-shrink-0 flex-grow-0 flex items-center justify-center">
									<Check class="h-4 w-4 text-primary-foreground" />
								</div>
							{/if}
						</div>
						{#if showCapacity}
							<div class="mt-4 flex items-center gap-2">
								<Users class="h-4 w-4 text-muted-foreground" />
								<span class="text-sm text-muted-foreground">{day.remainingCapacity} spots remaining</span>
							</div>

							<Progress value={day.remainingCapacity} max={day.totalCapacity} class="h-2 mt-4" />
						{/if}
					</Label>
				{/each}
			</ToggleGroup.Root>
		</div>
	</section>

	{#if addons.length > 0}
		<section>
			<h4 class=" font-extrabold text-sm text-stone-900">
				{$_('user-pages.events.additionalMarketingServices')}
			</h4>
			<p class=" mt-2 text-stone-500 font-normal text-sm">
				{$_('user-pages.events.additionalMarketingServicesDescription')}
			</p>
			<AddonList {addons} bind:selectedAddonPackages bind:selectedAddons />
		</section>
	{/if}
	<footer class=" flex mt-6 justify-end items-center">
		{#if canProceed()}
			<Button
				href={`${event?.id}/event-registration?${searchParams}`}>{$_('common.continue')}</Button>
		{:else}
			<Button disabled={true}>{$_('common.continue')}</Button>
		{/if}
	</footer>
</div>
