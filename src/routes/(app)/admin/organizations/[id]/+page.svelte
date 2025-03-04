<script lang="ts">
	import { Link, Tabs } from '@/@svelte/components';
	import {
		BookingsTab,
		CompanyInformationTab,
		PortraitsTab
	} from '@/@svelte/modules/CompanyDetails/components';

	import { fade } from 'svelte/transition';
	import { _ } from '@services';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let data;

	// $: ({ organization, orgMembers, createInviteForm, portraitTemplates, eventRegistrations } = data);

	let createInviteFormStore = writable(data.createInviteForm);
	$: {
		createInviteFormStore.set(data.createInviteForm);
	}

	setContext('createInviteForm', createInviteFormStore);

	let activeTab = 0;
	const tabHeadings = ['companyInformation', 'portraits', 'bookings'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

	function filterOrgEntries(tuple: [string, any]): tuple is [string, string] {
		const [key, value] = tuple;
		const excludedKeys = ['id', 'createdAt', 'modifiedAt', 'slug', 'name', 'organizationType', "imageUrl"];
		const keyValid = key != undefined && !excludedKeys.includes(key);
		const valueValid = typeof value === 'string';
		return keyValid && valueValid;
	}
</script>

<header class="space-y-4">
	<Link href="/admin/organizations">{$_("admin-pages.organizations.back-to-overview")}</Link>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{data.organization?.name}</h1>
	<p>{$_(`common.org-types.${data.organization?.publicMetadata?.type}`)}</p>
</header>
<div class="grid grid-cols-1 gap-4 w-full">
	<Tabs hasBorder={false} {tabHeadings} {activeTab} {handleTabChange} />
</div>
<section class=" mt-10 ">
	{#if activeTab === 0}
		<CompanyInformationTab
			organizationInfo={Object.entries(data.organization || {}).filter(filterOrgEntries).map(([key, value]) => ({ label: key, value }))}
			orgMembers={data.orgMembers} />
	{:else if activeTab === 1}
		<div in:fade>
			<PortraitsTab portraitTemplates={data.portraitTemplates} />
		</div>
	{:else if activeTab === 2}
		<div in:fade>
			<BookingsTab eventRegistrations={data.eventRegistrations} />
		</div>
	{/if}
</section>