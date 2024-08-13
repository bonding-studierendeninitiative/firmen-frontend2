<script lang="ts">
	import { _ } from '@services';
	import Tabs from '../../../../../lib/@svelte/components/Tabs/Tabs.svelte';
	import {
		ProfileTab,
		OrganizationTab,
		BillingTab,
		ArchivedTab,
		PasswordTab
	} from '$lib/@svelte/pages';
	import { fade } from 'svelte/transition';

	let activeTab = 0;
	const tabHeadings = ['profile', 'organization', 'password', 'billing', 'archived'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.accounts.account')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.accounts.accountSubHeading')}</h4>
	<div class=" mt-12">
		<Tabs {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	<section class=" mt-10">
		{#if activeTab === 0}
			<div class=" h-20">
				<ProfileTab />
			</div>
		{:else if activeTab === 1}
			<div in:fade>
				<OrganizationTab />
			</div>
		{:else if activeTab === 2}
			<div in:fade>
				<PasswordTab />
			</div>
		{:else if activeTab === 3}
			<div in:fade>
				<BillingTab />
			</div>
		{:else if activeTab === 4}
			<div in:fade>
				<ArchivedTab />
			</div>
		{/if}
	</section>
</div>
