<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';
	import { _ } from '@services';
	import {
		SearchInput,
		Table,
		NoDataFound,
		Chip,
		Modal,
		GradientButton,
		CheckboxSelect
	} from '$lib/@svelte/components';
	import Select from '$lib/@svelte/components/Select/Select.svelte';
	import {
		BrandingIcon,
		DocumentIcon,
		ImageIcon,
	} from '$lib/@svelte/icons';
	import toast from 'svelte-french-toast';

	export let data: PageServerData;

	const columns = [
		'company',
		'contactPerson',
		'number',
		'emailAddress',
		'date',
		'status',
		'uploads'
	];

	const addonsMainItems = [
		{ label: 'Onlinewerbung-Paket', value: 'Onlinewerbung-Paket', count: 120 },
		{ label: 'Printwerbung-Paket', value: 'Printwerbung-Paket', count: 80 }
	];
	const packagesMainItems = [
		{ label: 'light', value: 'light', count: 120 },
		{ label: 'standard', value: 'standard', count: 120 },
		{ label: 'premium', value: 'premium', count: 120 }
	];
	const addonsOtherItems = [
		{ label: 'Bonding-Infomails', value: 'Bonding-Infomails', count: 2 },
		{ label: 'Messewebsite', value: 'Messewebsite', count: 0 },
		{ label: 'SocialMe.-Firmenvorstellung', value: 'SocialMe.-Firmenvorstellung', count: 100 },
		{ label: 'Flyer', value: 'Flyer', count: 150 }
	];
	$: eventRegistrations = data.eventRegistrations;

	$: eventRegistrationsPageCount = data.eventRegistrationsPageCount;
	$: eventRegistrationsPage = data.eventRegistrationsPage;

	let isOpen = false;

	const handleChipClick = (index: number, status: string) => {
		isOpen = true;
	};

	const handleUpdateStatus = () => {
		isOpen = false;
		toast.success('status updated successfully');
	};

	const handleRowClick = (id: number) => {
		goto(`/admin/events/${id}/event-details`);
	};
</script>

<Modal bind:isOpen>
	<div class=" flex flex-col justify-center items-center">
		<div class=" text-start">
			<h2 class=" text-stone-950 font-extrabold text-base">
				{$_('admin-pages.events.statusUpdate')}
			</h2>
			<p class="mt-2 text-stone-500 text-base">
				{$_('admin-pages.events.statusUpdateText')}
			</p>
		</div>
		<div class="my-6 w-full">
			<Select placeholder={$_('admin-pages.events.updateStatus')}></Select>
		</div>
	</div>
	<footer class=" flex items-center justify-end">
		<GradientButton classes="!py-1.5" onClick={handleUpdateStatus}
		>{$_('common.update')}</GradientButton
		>
	</footer>
</Modal>
<section class=" mt-10 flex justify-between w-full">
	<SearchInput placeholder={$_('common.search')} />
	<div class="  max-w-[540px] flex items-center justify-end">
		<div class=" mr-3 w-full">
			<CheckboxSelect
				placeholder={$_('common.addons')}
				width="289px"
				mainItems={addonsMainItems}
				otherItems={addonsOtherItems}
			/>
		</div>
		<CheckboxSelect
			placeholder={$_('common.packages')}
			width="215px"
			mainItems={packagesMainItems}
		/>
	</div>
</section>

<section class=" mt-6">
	{#if !eventRegistrations}
		<section class=" mt-10">
			<NoDataFound
				heading={$_('admin-pages.events.noRegistrationsFound')}
				subHeading={$_('admin-pages.events.noDataToDisplay')}
				buttonText={$_('admin-pages.events.backToEvents')}
			/>
		</section>
	{:else}
		<section class=" mt-10">
			<Table totalRecords={9} {columns}>
				{#each eventRegistrations as {
					comment,
					contactPerson,
					participationNote,
					email,
					date,
					status,
					statusText
				}, index}
					<tr
						on:click={() => handleRowClick(index)}
						class={` cursor-pointer ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}
					>
						<td class=" px-6 py-4 text-sm">{comment}</td>
						<td class=" px-6 py-4 text-sm">{contactPerson}</td>
						<td class=" px-6 py-4 text-sm">{participationNote}</td>
						<td class=" px-6 py-4 text-sm">{email}</td>
						<td class=" px-6 py-4 text-sm"><p class=" m-0 p-0 text-gray-500">{date}</p></td>
						<td class=" px-6 py-4"
						>
							<Chip
								status={statusText}
								variant={statusText}
								classes="cursor-pointer"
								handleChipClick={() => handleChipClick(index, status)}
							/>
						</td
						>
						<td class=" px-6 py-4 flex">
							<button>
								<ImageIcon />
							</button>
							<button>
								<DocumentIcon />
							</button>
							<button>
								<BrandingIcon />
							</button>
						</td>
					</tr>
				{/each}
			</Table>
		</section>
	{/if}
</section>
