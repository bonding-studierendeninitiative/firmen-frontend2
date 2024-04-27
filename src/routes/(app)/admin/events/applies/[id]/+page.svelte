<script lang="ts">
	import { goto } from '$app/navigation';
	import { _ } from '@services';
	import {
		SearchInput,
		Tabs,
		Table,
		NoDataFound,
		Chip,
		Modal,
		GradientButton
	} from '$lib/@svelte/components';
	import Select from '$lib/@svelte/components/Select/Select.svelte';
	import {
		BrandingIcon,
		DocumentIcon,
		ReturnIcon,
		ImageIcon,
		CalenderIcon,
		LocationIcon
	} from '$lib/@svelte/icons';
	import toast from 'svelte-french-toast';

	let activeTab = 0;
	let showListings: boolean = false;
	export let heading = 'Tech Foundation 2024';
	export let mainDate = 'Freitag, 17 März, 2024';
	export let mainLocation = 'Lanxess Arena';
	const tabHeadings = ['all', 'newApplies', 'confirmedApplies', 'declinedApplies'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

	const columns = [
		'company',
		'contactPerson',
		'number',
		'emailAddress',
		'date',
		'status',
		'uploads'
	];

	const eventList: any = [
		{
			company: 'Google Inc',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'verification'
		},
		{
			company: 'Microsoft',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '25.12.24',
			statusText: 'verification'
		},
		{
			company: 'Facebook',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'confirmed'
		},
		{
			company: 'Apple',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'rejected'
		},
		{
			company: 'Dell',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'confirmed'
		},
		{
			company: 'Google Inc',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'rejected'
		},
		{
			company: 'Microsoft',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '25.12.24',
			statusText: 'confirmed'
		},
		{
			company: 'Facebook',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'rejected'
		},
		{
			company: 'Apple',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'rejected'
		},
		{
			company: 'Dell',
			contact: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			date: '01.12.24 ',
			statusText: 'rejected'
		}
	];

	const toggleListing = () => {
		showListings = true;
	};

	let isOpen = false;

	const handleChipClick = (index: number, status: string) => {
		isOpen = true;
	};

	const handleUpdateStatus = () => {
		isOpen = false;
		toast.success('status updated successfully');
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
<div>
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<button
				on:click={() => goto('/admin/events')}
				class="  h-10 w-10 flex flex-shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
				><ReturnIcon /></button
			>
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{heading}</h4>
				<div class=" flex mt-2">
					<span class=" flex items-center mr-2">
						<!-- svelte-ignore missing-declaration -->
						<CalenderIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{mainDate}</p>
					</span>
					<span class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{mainLocation}</p>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class=" mt-12">
		<Tabs {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	<section class=" mt-10 flex justify-between w-full">
		<SearchInput placeholder={$_('common.search')} />
		<div class=" w-full max-w-[540px] flex items-center justify-end">
			<div class=" mr-3 w-full">
				<Select placeholder={$_('common.addons')} />
			</div>
			<Select placeholder={$_('common.packages')} />
		</div>
	</section>

	<section class=" mt-6">
		{#if !showListings}
			<section class=" mt-10">
				<NoDataFound
					heading={$_('admin-pages.events.noAppliesFound')}
					subHeading={$_('admin-pages.events.noDataToDisplay')}
					buttonText={$_('admin-pages.events.backToEvents')}
					onButtonClick={toggleListing}
				/>
			</section>
		{:else}
			<section class=" mt-10">
				<Table totalRecords={9} {columns}>
					{#each eventList as { company, contact, number, email, date, status, statusText }, index}
						<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
							<td class=" px-6 py-4 text-sm">{company}</td>
							<td class=" px-6 py-4 text-sm">{contact}</td>
							<td class=" px-6 py-4 text-sm">{number}</td>
							<td class=" px-6 py-4 text-sm">{email}</td>
							<td class=" px-6 py-4 text-sm"><p class=" m-0 p-0 text-gray-500">{date}</p></td>
							<td class=" px-6 py-4"
								><Chip
									status={statusText}
									variant={statusText}
									classes="cursor-pointer"
									handleChipClick={() => handleChipClick(index, status)}
								/></td
							>
							<td class=" px-6 py-4 flex">
								<button><ImageIcon /> </button>
								<button><DocumentIcon /> </button>
								<button><BrandingIcon /> </button>
							</td>
						</tr>
					{/each}
				</Table>
			</section>
		{/if}
	</section>
</div>
