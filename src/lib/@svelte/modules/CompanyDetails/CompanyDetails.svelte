<script lang="ts">
	import { _ } from '@services';
	import { Drawer, Tabs } from '$lib/@svelte/components';
	import { fade } from 'svelte/transition';
	import { CompanyInformationTab } from './components';
	import PortraitsTab from './components/PortraitsTab/PortraitsTab.svelte';
	import BookingsTab from './components/BookingsTab/BookingsTab.svelte';

	export let isOpen: boolean = false;

	let activeTab = 0;
	const tabHeadings = ['companyInformation', 'portraits', 'bookings'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.companies.companyDetails')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<div>
		<div class="grid grid-cols-1 gap-4 w-full">
			<Tabs hasBorder={false} {tabHeadings} {activeTab} {handleTabChange} />
		</div>
		<section class=" mt-10 max-h-[590px] overflow-y-scroll">
			{#if activeTab === 0}
				<div>
					<CompanyInformationTab />
				</div>
			{:else if activeTab === 1}
				<div in:fade>
					<PortraitsTab />
				</div>
			{:else if activeTab === 2}
				<div in:fade>
					<BookingsTab />
				</div>
			{/if}
		</section>
	</div>
</Drawer>
