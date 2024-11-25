<script lang="ts">
	import { _ } from '@services';
	import { Drawer, Tabs } from '$lib/@svelte/components';
	import { fade } from 'svelte/transition';
	import { CompanyInformationTab } from './components';
	import PortraitsTab from './components/PortraitsTab/PortraitsTab.svelte';
	import BookingsTab from './components/BookingsTab/BookingsTab.svelte';
	import type { GetOrgMembersResponse } from '@schema';

	export let isOpen: boolean = false;

	export let organization: any;

	export let orgMembers: GetOrgMembersResponse;

	let activeTab = 0;
	const tabHeadings = ['companyInformation', 'portraits', 'bookings'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.organizations.organizationDetails')}
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
					<CompanyInformationTab organizationInfo={Object.entries(organization).filter(
						([key, value]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== undefined
					).map(([key, value]) => ({ label: key, value }))} orgMembers={orgMembers} />
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
