<script lang="ts">
	import { goto } from '$app/navigation';
	import { _ } from '@services';
	import { Tabs } from '$lib/@svelte/components';
	import { ReturnIcon, CalenderIcon, LocationIcon } from '$lib/@svelte/icons';
	import { CompanyInformationTab, PortraitTab } from '$lib/@svelte/pages';
	import UploadsTab from '$lib/@svelte/pages/Events/UploadsTab/UploadsTab.svelte';
	import { Button } from '@/components/ui/button';

	let activeTab = 0;
	export let heading = 'Tech Foundation 2024';
	export let mainDate = 'Freitag, 17 März, 2024';
	export let mainLocation = 'Lanxess Arena';
	const tabHeadings = ['companyInformation', 'portrait', 'uploads'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<div>
	<div class=" flex justify-between items-center">
		<div class=" flex items-center">
			<button
				on:click={() => goto('/admin/events')}
				class="  h-10 w-10 flex flex-shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
				><ReturnIcon /></button
			>
			<h4 class=" text-xl font-extrabold text-stone-800">
				{$_('user-pages.events.registrationForm')}
			</h4>
		</div>
	</div>
	<hr class=" border-t border-stone-200 my-6" />
	<div class=" flex items-center justify-between">
		<div>
			<h4 class=" text-xl font-extrabold text-stone-800">{heading}</h4>
			<div class=" flex mt-2">
				<div class=" flex items-center mr-2">
					<CalenderIcon />
					<p class=" ml-2 text-sm text-stone-800 font-medium">{mainDate}</p>
				</div>
				<div class=" flex items-center">
					<LocationIcon />
					<p class=" ml-2 text-sm text-stone-800 font-medium">{mainLocation}</p>
				</div>
			</div>
		</div>
		<div class=" flex items-center">
			<Button variant="outline" class=" mr-2 !py-1.5 !px-4" on:click={() => undefined}>
				{$_('common.exportFiles')}
			</Button>
			<Button variant="gradient" class=" !py-1.5 !px-4" on:click={() => undefined}>
				{$_('common.edit')}
			</Button>
		</div>
	</div>
	<hr class=" border-t border-stone-200 my-6" />
	<div>
		<Tabs {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	<section class=" mt-10">
		{#if activeTab === 0}
			<CompanyInformationTab />
		{:else if activeTab === 1}
			<PortraitTab />
		{:else if activeTab === 2}
			<UploadsTab />
		{/if}
	</section>
</div>
