<script lang="ts">
	import { _ } from '@services';
	import { Accordion, Badge, GradientButton, Link, Table } from '$lib/@svelte/components';
	import { AddAddon } from '$lib/@svelte/modules';
	import PlusIcon from '$lib/@svelte/icons/PlusIcon.svelte';
	import { fade } from 'svelte/transition';
	import type { PageServerData } from './$types';
	import { Helper, Pagination } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import * as Card from '@/components/ui/card';

	const columns = ['addonsName', 'subAddons', 'price', 'saleTag', ''];

	export let data: PageServerData;
	$: addonPackageTemplates = data.addonPackageTemplates;
	export let isAccordionOpen: boolean = false;
	export let isDrawerOpen: boolean = false;
	$: page = data.addonPackageTemplatesPage || 0;
	$: totalPages = data.addonPackageTemplatesPageCount || 0;
	$: pages = new Array(totalPages || 0).fill(0).map((_, index) => ({
		name: `${index + 1}`,
		href: `?page=${index}`,
		active: index === page
	}));

	const gotoPreviousPage = () => {
		if (page && page > 0) {
			goto(`?page=${page - 1}`);
		}
	};
	const gotoNextPage = () => {
		if (page !== undefined && page < totalPages - 1) {
			goto(`?page=${page + 1}`);
		}
	};
</script>

<section>
	<div class=" flex justify-between items-center">
		<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('common.addons')}</h1>
		<div>
			<GradientButton onClick={() => (isDrawerOpen = true)}
			>{$_('admin-pages.addons.addAddons')}</GradientButton
			>
		</div>
	</div>
</section>

{#if addonPackageTemplates}
	<section class=" mt-10 flex flex-col gap-y-2">
		<Table totalRecords={9} {columns} classes=" w-[1000px] overflow-x-scroll">
			<!--<tr class={`w-full ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td colspan="5">
					<Accordion>
						<tr
							slot="header"
							on:click={() => (isAccordionOpen = !isAccordionOpen)}
							class={`w-full ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}
						>
							<td class="px-6 py-4 text-grey-900 text-sm">
								<div class=" flex items-center">
								<span class="transition group-open:rotate-45 mr-2">
									<PlusIcon />
								</span>

								</div>
							</td>
							<td class="py-4 text-grey-900 text-sm"
							><p class=" p-0 m-o flex items-center justify-center font-extrabold">
								{description}
							</p></td
							>
							<td class="py-4 text-grey-900 text-sm"
							><p class=" p-0 m-o flex items-center justify-end font-extrabold">{price}</p></td
							>
							<td class="py-4 text-grey-900 text-sm"
							>
								<p class=" p-0 m-o flex items-center justify-end">
									<Badge>{label}</Badge>
								</p>
							</td
							>
							<td class="w-[190px] px-6 py-4 text-grey-500 text-sm text-end">
							<span class=" p-0 m-o flex items-center justify-end"
							><Link>{$_('common.edit')}</Link></span
							></td
							>
						</tr>

						<table
							slot="details"
							in:fade
							class="p-0 m-0 text-neutral-600 group-open:animate-fadeIn"
						>
							{#each addons as { title, price, label, description }}
								<tr on:click={() => (isAccordionOpen = !isAccordionOpen)}>
									<td class=" w-[300px] !pl-16 py-4 text-grey-900 text-sm">
										<div class=" flex items-center">
											<span>{title}</span>
										</div>
									</td>
									<td class="w-[80px] py-4 text-grey-900 text-sm">
										<Badge>{label}</Badge>
									</td>
									<td class="w-[220px] py-4 text-grey-900 text-sm">
										<p class=" p-0 m-o flex items-center justify-end">{price}</p>
									</td>
								</tr>
								<tr>
									<td>
										<Helper>{description}</Helper>
									</td>
								</tr>
							{/each}
						</table>
					</Accordion>
				</td>
			</tr>-->
		</Table>
		{#each addonPackageTemplates as { title, description, price, label, addons }, index}
			<Card.Root>
				<Card.Header>
					<span class="text-md">{title}</span>
				</Card.Header>
				<Card.Content>
					{description}
				</Card.Content>
			</Card.Root>
		{/each}
		{#if totalPages > 0}
			<Pagination on:previous={gotoPreviousPage} on:next={gotoNextPage} large {pages} />
		{/if}
	</section>
{/if}
<AddAddon validated={data.form} bind:isOpen={isDrawerOpen} />
