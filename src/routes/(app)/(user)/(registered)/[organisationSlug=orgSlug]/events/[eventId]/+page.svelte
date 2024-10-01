<script lang="ts">
	import { _ } from '@services';
	import { Button } from '@/components/ui/button';
	import * as Breadcrumb from '@/components/ui/breadcrumb';

	import { page } from '$app/stores';
	import {
		OutlinedCheckIcon,
		OutlinedCrossIcon,
		CalenderIcon,
		LocationIcon
	} from '@/@svelte/icons';

	import * as Table from '@/components/ui/table';
	import type {
		PageData
	} from '../../../../../../../../.svelte-kit/types/src/routes';
	import dayjs from 'dayjs';
	import AddonList from '@/@svelte/components/AddonList/AddonList.svelte';
	import { number } from '@services/i18n';

	export let data: PageData;
	let { buyOption, event, packages: addons }: PageData = data;

	let selectedPackageID = '';
	let selectedAddonsURL = '';
	let selectedAddons: string[] = [];


	$: selectedAddonsURL = selectedAddons.length == 0 ? '' : '&selectedAddon=' + selectedAddons.join('&selectedAddon=');


</script>

<div class="mb-10">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={`/${$page.params.organizationSlug}/events`}>
					{$_('user-pages.events.events')}
				</Breadcrumb.Link>>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>{event.name}</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>


</div>
<div>
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{event.name}</h4>
				<div class=" flex mt-2">
					<div class=" flex items-center mr-2">
						<CalenderIcon />
						{#if event.dateTo && (dayjs(event.dateFrom) !== dayjs(event.dateTo))}
							<p class=" ml-2 text-sm text-stone-800 font-medium">{dayjs(event.dateFrom).format('DD.MM.YYYY')}
								- {dayjs(event.dateTo).format('DD.MM.YYYY')}</p>
						{:else }
							<p class=" ml-2 text-sm text-stone-800 font-medium">{dayjs(event.dateFrom).format('DD.MM.YYYY')}</p>
						{/if}
					</div>
					<div class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{event.location}</p>
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
			{event.descriptionNotes}
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
					<Table.Cell class={`w-1/${buyOption.packages.length +1}`}></Table.Cell>
					{#each buyOption.packages as pkg}
						<Table.Cell class={`w-1/${buyOption.packages.length +1} p-3`}>
							<div>
								<p class=" text-brand text-sm font-medium">{pkg.name}</p>
								<p class=" font-extrabold text-2xl mt-2">{$number((pkg.price ?? 0) / 100, {
									style: "currency",
									currency: "EUR",
									currencyDisplay: "code"
								})}</p>
							</div>
						</Table.Cell>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each buyOption.services as service, index (index)}
					<Table.Row class="even:bg-stone-50">
						<Table.Cell class="  p-3 border border-stone-200 text-sm">{service.name}</Table.Cell>
						{#each buyOption.packages as pkg}
							<Table.Cell
								class={selectedPackageID === pkg.id ? "p-3 border border-stone-200 bg-slate-300" : "p-3 border border-stone-200"}>
								<div class="flex justify-center items-center">
									{#if service.valueType === "BOOLEAN"}
										{#if pkg.benefits[index].booleanValue}
											<OutlinedCheckIcon />
										{:else}
											<OutlinedCrossIcon />
										{/if}
									{/if}
									{#if service.valueType === "INTEGER"}
										{pkg.benefits[index].numericValue}
									{/if}

									{#if service.valueType === "STRING"}
										{pkg.benefits[index].stringValue}
									{/if}
								</div>
							</Table.Cell>
						{/each}

					</Table.Row>
				{/each}
				<Table.Row>
					<Table.Cell></Table.Cell>
					{#each buyOption.packages as pkg}
						<Table.Cell class=" p-3">
							<div class=" flex justify-center items-center">
								<Button on:click={() => selectedPackageID=pkg.id}
												variant={selectedPackageID === pkg.id? "default" : "outline"} class="!py-1.5 !px-4">
									{$_('common.select')}
								</Button>
							</div>
						</Table.Cell>
					{/each}

				</Table.Row>
			</Table.Body>
		</Table.Root>
	</section>

	<AddonList {addons} bind:selectedAddons={selectedAddons} />
	<footer class=" flex mt-6 justify-end items-center">
		{#if selectedPackageID !== ""}
			<a aria-disabled="true"
				 href={`${event.id}/event-registration?selectedPackage=${selectedPackageID + selectedAddonsURL}`}>
				<Button>{$_('common.continue')}</Button>
			</a>
		{:else }
			<Button disabled={true}>{$_('common.continue')}</Button>
		{/if}
	</footer>
</div>
