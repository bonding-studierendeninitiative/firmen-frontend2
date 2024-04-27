<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { NoDataFound, Button } from '$lib/@svelte/components';
	import { SimpleDocumentIcon } from '$lib/@svelte/icons';
	import AddPortrait from '$lib/@svelte/modules/AddPortrait/AddPortrait.svelte';

	let showListings: boolean = false;
	const handleViewAllEvent = () => {
		goto('/events');
	};
	const toggleListing = () => {
		isDrawerOpen = true;
	};
	interface EventListType {
		event: string;
		location: string;
		date: string;
		status: 'success' | 'info';
		statusText: string;
	}

	const colors = ['#EA580C', '#EAB308', '#B91C1C', '#15803D', '#155E75', '#9D174D'];
	const portraits = [
		'Energieversersorgung',
		'Softwareentwicklung',
		'Architektur',
		'Biologie',
		'Jura',
		'Wirstchafts'
	];

	let isDrawerOpen = false;
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.portraits.portraits')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.portraits.portraitsSubHeading')}</h4>

	{#if !showListings}
		<section class=" mt-10">
			<div class="mt-2">
				<NoDataFound
					heading={$_('user-pages.portraits.noPortraitsFound')}
					subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
					buttonText={$_('user-pages.portraits.newPortrait')}
					onButtonClick={toggleListing}
				/>
			</div>
		</section>
	{:else}
		<section class=" mt-10">
			{#each portraits as portrait, index}
				<div class=" flex justify-between items-center mb-6">
					<div class=" flex">
						<div
							style={`background-color:${colors[index % 6]} ;`}
							class={`rounded-lg inline-flex justify-center items-center  w-12 h-12`}
						>
							<SimpleDocumentIcon />
						</div>
						<div class=" flex flex-col ml-4">
							<h3 class=" text-base font-extrabold text-stone-800">{portrait}</h3>
							<h4 class=" text-sm font-normal text-stone-800">
								{$_('user-pages.portraits.portrait')} # {index + 1}
							</h4>
						</div>
					</div>
					<Button onClick={handleViewAllEvent} classes=" inline shadow-custom !py-1"
						>{$_('common.viewDetails')}</Button
					>
				</div>
			{/each}
		</section>
	{/if}
</div>
<AddPortrait bind:isOpen={isDrawerOpen} bind:showListings />
