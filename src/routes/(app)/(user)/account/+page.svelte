<script lang="ts">
	import Tabs from '$lib/@svelte/components/Tabs/Tabs.svelte';
	import { ProfileTab, OrganizationTab, BillingTab, ArchivedTab } from '$lib/@svelte/pages';
	import PasswordTab from '$lib/@svelte/pages/Account/PasswordTab/PasswordTab.svelte';
	import { fade } from 'svelte/transition';

	let activeTab = 0;
	const tabHeadings = ['Profile', 'Organization', 'Password', 'Billing', 'Archived'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">Account</h1>
	<h4 class=" text-stone-500">Update your profile and organization details here.</h4>
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
