<script lang="ts">
	import { Link, Tabs } from '@/@svelte/components';
	import {
		BookingsTab,
		CompanyInformationTab,
		PortraitsTab
	} from '@/@svelte/modules/CompanyDetails/components/index.js';

	import { fade } from 'svelte/transition';
	import type { PageServerData } from './$types';
	import SuperDebug from 'sveltekit-superforms';

	export let data: PageServerData;
	export let organization = data?.organization;
	export let orgMembers = data?.orgMembers || [];
	export let portraitTemplates = data?.portraitTemplates || [];
	export let eventRegistrations = data?.eventRegistrations || [];

	let activeTab = 0;
	const tabHeadings = ['companyInformation', 'portraits', 'bookings'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

	function filterOrgEntries(tuple: [string, any]): tuple is [string, string] {
		const [key, value] = tuple;
		const excludedKeys = ['id', 'createdAt', 'modifiedAt', 'slug', 'name', 'organizationType'];
		const keyValid = key != undefined && !excludedKeys.includes(key);
		const valueValid = typeof value === 'string';
		return keyValid && valueValid;
	}
</script>
<div>

	<header class="space-y-4">
		<Link href="/admin/organizations">⮐ Zurück zu allen Organisationen</Link>
		<h1 class=" text-stone-950 text-3xl font-extrabold">{organization?.name}</h1>
		<p>{organization?.organizationType}</p>
	</header>
	<div class="grid grid-cols-1 gap-4 w-full">
		<Tabs hasBorder={false} {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	<section class=" mt-10 max-h-[590px] overflow-y-scroll">
		{#if activeTab === 0}
			<div>
				<CompanyInformationTab
					organizationInfo={Object.entries(organization || {}).filter(filterOrgEntries).map(([key, value]) => ({ label: key, value }))}
					{orgMembers} />
			</div>
		{:else if activeTab === 1}
			<div in:fade>
				<PortraitsTab {portraitTemplates} />
			</div>
		{:else if activeTab === 2}
			<div in:fade>
				<BookingsTab />
			</div>
		{/if}
	</section>
</div>