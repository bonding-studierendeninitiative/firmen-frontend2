<script lang="ts">
	import type { PageData } from './$types';
	import { Tabs } from '@/@svelte/components';
	import { PortraitCompanyTab, PortraitContactTab } from '@/@svelte/pages/Portraits';
	import { fade } from 'svelte/transition';
	import { LoaderCircle } from 'lucide-svelte';

	export let data: PageData;
	let activeTab = 0;
	const tabHeadings = ['portrait-company', 'portrait-contact'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

{#await data.portraitTemplate}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then portraitTemplate}
	<h1 class=" text-stone-950 text-3xl font-extrabold">"{portraitTemplate?.displayName}"</h1>
	<h3 class=" text-stone-500 text-lg font-medium font-mono">{portraitTemplate?.id}</h3>
{:catch error}
	<p class=" text-red-500 text-lg font-medium">{error.message}</p>
{/await}
<div class=" mt-12">
	<Tabs {tabHeadings} {activeTab} {handleTabChange} />
</div>
<section class=" mt-10">
	{#if activeTab === 0}
		<div class=" h-20">
			{#await data.updatePortraitCompanyDetailsForm}
				<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
			{:then updatePortraitCompanyDetailsForm}
				<PortraitCompanyTab data={updatePortraitCompanyDetailsForm} />
			{:catch error}
				<p class=" text-red-500 text-lg font-medium">{error.message}</p>
			{/await}
		</div>
	{:else if activeTab === 1}
		<div in:fade>
			{#await data.updatePortraitContactInfoForm}
				<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
			{:then updatePortraitContactInfoForm}
				<PortraitContactTab data={updatePortraitContactInfoForm} />
			{:catch error}
				<p class=" text-red-500 text-lg font-medium">{error.message}</p>
			{/await}
		</div>
	{/if}
</section>
