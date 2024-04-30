<script lang="ts">
	import { goto } from '$app/navigation';
	import { _ } from '@services';
	import { GradientButton, Tabs, Button } from '$lib/@svelte/components';
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
	import { CompanyInformationTab, PortraitTab } from '$lib/@svelte/pages';
	import UploadsTab from '$lib/@svelte/pages/Events/UploadsTab/UploadsTab.svelte';

	let activeTab = 0;
	let showListings: boolean = false;
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
		<div class=" flex items-center">
			<Button classes=" mr-2 !py-1.5 !px-4" onClick={() => undefined}
				>{$_('common.exportFiles')}</Button
			>
			<GradientButton classes=" !py-1.5 !px-4" onClick={() => undefined}
				>{$_('common.edit')}</GradientButton
			>
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
