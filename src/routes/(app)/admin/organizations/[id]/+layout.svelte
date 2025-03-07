<script lang="ts">
	import { Link, LinkTabs, Tabs } from '@/@svelte/components';
	import {
		BookingsTab,
		CompanyInformationTab,
		PortraitsTab
	} from '@/@svelte/modules/CompanyDetails/components';

	import { fade } from 'svelte/transition';
	import { _ } from '@services';
	import { LoaderCircle } from 'lucide-svelte';
	import SuperDebug from 'sveltekit-superforms';

	export let data;

	let activeTab = 0;
	const tabHeadings = ['companyInformation', 'portraits', 'bookings'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};


	const tabs = [{
		name: 'companyInformation',
		href: './overview'
	}, {
		name: 'portraits',
		href: './portraits'
	}, {
		name: 'bookings',
		href: './registrations'
	}];


</script>

{#await data.organizationDetails}
	<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
{:then organizationDetails}
	<header class="space-y-2">
		<Link href="/admin/organizations">{$_("admin-pages.organizations.back-to-overview")}</Link>
		<h1 class=" text-stone-950 text-3xl font-extrabold">{organizationDetails?.organization.name}</h1>
		{#if organizationDetails?.organization.publicMetadata?.type}
			<p>{$_(`common.org-types.${organizationDetails?.organization.publicMetadata?.type}`)}</p>
		{/if}
	</header>
	<LinkTabs tabs={[{
		name: 'companyInformation',
		href: `overview`
	}, {
		name: 'portraits',
		href: `portraits`
	}, {
		name: 'bookings',
		href: `registrations`
	}]} />

	<slot />
{:catch error}
	<p>{error.message}</p>
{/await}
