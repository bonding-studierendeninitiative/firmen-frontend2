<script lang="ts">
	import type { PageData } from './$types';
	import { Tabs } from '@/@svelte/components';
	import { PortraitCompanyTab, PortraitContactTab } from '@/@svelte/pages/Portraits';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	$: portraitTemplate = data.portraitTemplate;
	let activeTab = 0;
	const tabHeadings = ['portrait-company', 'portrait-contact'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};
</script>

<h1 class=" text-stone-950 text-3xl font-extrabold">"{portraitTemplate?.displayName}"</h1>
<h3 class=" text-stone-500 text-lg font-medium font-mono">{portraitTemplate?.id}</h3>
<div class=" mt-12">
	<Tabs {tabHeadings} {activeTab} {handleTabChange} />
</div>
<section class=" mt-10">
	{#if activeTab === 0}
		<div class=" h-20">
			<PortraitCompanyTab data={data.updatePortraitCompanyDetailsForm} />
		</div>
	{:else if activeTab === 1}
		<div in:fade>
			<PortraitContactTab data={data.updatePortraitContactInfoForm} />
		</div>
	{/if}
</section>
