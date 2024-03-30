<script lang="ts">
	import { Accordion, Badge, GradientButton, Link, Table } from '$lib/@svelte/components';
	import { AddAddon } from '$lib/@svelte/modules';
	import PlusIcon from '$lib/@svelte/icons/PlusIcon.svelte';
	import { fade } from 'svelte/transition';

	const columns = ['Addons Name', 'Sub Addons', 'Price', 'Sale Tag', ''];

	const addonList = [
		{
			addon: 'Onlinewerbung-Paket',
			subAddon: '4',
			price: '€850',
			tag: '10%',
			details: [
				{
					addon: 'Onlinewerbung-Paket',
					price: '€350'
				},
				{
					addon: 'Onlinewerbung-Paket',
					price: '€200'
				},
				{
					addon: 'Onlinewerbung-Paket',
					price: '€100'
				},
				{
					addon: 'Onlinewerbung-Paket',
					price: '€200'
				}
			]
		},
		{
			addon: 'Printwerbung-Paket',
			subAddon: '4',
			price: '€850',
			tag: '10%',
			details: [
				{
					addon: 'Printwerbung-Paket',
					price: '€350'
				},
				{
					addon: 'Printwerbung-Paket',
					price: '€200'
				},
				{
					addon: 'Printwerbung-Paket',
					price: '€100'
				},
				{
					addon: 'Printwerbung-Paket',
					price: '€200'
				}
			]
		},
		{
			addon: 'Sonstiges',
			subAddon: '4',
			price: '€850',
			tag: '10%',
			details: [
				{
					addon: 'Sonstiges',
					price: '€350'
				},
				{
					addon: 'Sonstiges',
					price: '€200'
				},
				{
					addon: 'Sonstiges',
					price: '€100'
				},
				{
					addon: 'Sonstiges',
					price: '€200'
				}
			]
		},
		{
			addon: 'Bonding-Tüte',
			subAddon: '4',
			price: '€850',
			tag: '10%',
			details: [
				{
					addon: 'Bonding-Tüte',
					price: '€350'
				},
				{
					addon: 'Bonding-Tüte',
					price: '€200'
				},
				{
					addon: 'Bonding-Tüte',
					price: '€100'
				},
				{
					addon: 'Bonding-Tüte',
					price: '€200'
				}
			]
		}
	];
	export let isAccordionOpen: boolean = false;
	export let isDrawerOpen: boolean = false;
</script>

<section>
	<div class=" flex justify-between items-center">
		<h1 class=" text-stone-950 text-3xl font-extrabold">Addons</h1>
		<div>
			<GradientButton onClick={() => (isDrawerOpen = true)}>Add Addons</GradientButton>
		</div>
	</div>
</section>

<section class=" mt-10">
	<Table totalRecords={9} {columns} classes=" w-[1000px] overflow-x-scroll">
		{#each addonList as { addon, subAddon, price, tag, details }, index}
			<tr class={`w-full ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
				<td colspan="5">
					<Accordion>
						<tr
							slot="header"
							on:click={() => (isAccordionOpen = !isAccordionOpen)}
							class={`w-full ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}
						>
							<td class=" w-[300px] px-6 py-4 text-grey-900 text-sm">
								<div class=" flex items-center">
									<span class="transition group-open:rotate-45 mr-2">
										<PlusIcon />
									</span>
									{addon}
								</div>
							</td>
							<td class="w-[80px] py-4 text-grey-900 text-sm"
								><p class=" p-0 m-o flex items-center justify-center font-extrabold">
									{subAddon}
								</p></td
							>
							<td class="w-[220px] py-4 text-grey-900 text-sm"
								><p class=" p-0 m-o flex items-center justify-end font-extrabold">{price}</p></td
							>
							<td class="w-[180px] py-4 text-grey-900 text-sm"
								><p class=" p-0 m-o flex items-center justify-end"><Badge>{tag}</Badge></p></td
							>
							<td class="w-[190px] px-6 py-4 text-grey-500 text-sm text-end">
								<span class=" p-0 m-o flex items-center justify-end"><Link>Edit</Link></span></td
							>
						</tr>

						<table
							slot="details"
							in:fade
							class="p-0 m-0 text-neutral-600 group-open:animate-fadeIn"
						>
							{#each details as { addon, price }}
								<tr on:click={() => (isAccordionOpen = !isAccordionOpen)}>
									<td class=" w-[300px] !pl-16 py-4 text-grey-900 text-sm">
										<div class=" flex items-center">
											{addon}
										</div>
									</td>
									<td class="w-[80px] py-4 text-grey-900 text-sm"
										><p class=" p-0 m-o flex items-center justify-center"></p></td
									>
									<td class="w-[220px] py-4 text-grey-900 text-sm"
										><p class=" p-0 m-o flex items-center justify-end">{price}</p></td
									>
								</tr>
							{/each}
						</table>
					</Accordion>
				</td>
			</tr>
		{/each}
	</Table>
</section>
<AddAddon bind:isOpen={isDrawerOpen} />
