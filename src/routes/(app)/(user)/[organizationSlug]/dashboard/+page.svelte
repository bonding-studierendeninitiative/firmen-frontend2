<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { EventInfoBox, Button, NoDataFound, SkeletonEventInfoBox } from '@/@svelte/components';
	import type { PageData } from './$types';
	import { RegisteredEventList } from '@/@svelte/modules/RegisteredEventList';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import * as Dialog from '$lib/components/ui/dialog';
	export let data: PageData;
	const handleViewAllEvent = () => {
		goto('/events');
	};

</script>

<div>

	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.dashboard.dashboard')}</h1>
	<h4 class=" text-stone-500">
		{$_('user-pages.dashboard.subHeading', {
			values: {
				name: data.user?.fullName ?? data.user?.firstName + " " + data.user?.lastName
			}
		})}
	</h4>
	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.upcomingEvents')}
			</h2>
			<Button onClick={handleViewAllEvent} classes=" shadow-custom  !py-2"
			>{$_('common.viewAll')}</Button
			>
		</div>
		{#await data.events}
			<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
				{#each [0, 0, 0, 0] as _}
					<SkeletonEventInfoBox />
				{/each}
			</div>
		{:then events}
			<div in:fade class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
				{#each events || [] as { name, location, dateFrom, id }, index (index)}
					<EventInfoBox
						heading={name}
						subHeading={location}
						date={dateFrom}
						href={`/${data.initialState.orgSlug}/events/${id}`}
					/>
				{/each}
			</div>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.registeredEvents')}
			</h2>
		</div>
		{#await data.dashboardData}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then dashboardData}
			<div in:fade class="mt-2">
				{#if dashboardData?.eventRegistrations?.eventRegistrations?.length > 0 }
					<RegisteredEventList uploadCatalogueDataForm={dashboardData?.uploadCatalogueDataForm}
															 eventRegistrations={dashboardData?.eventRegistrations} />
				{:else }
					<NoDataFound
						heading={$_('user-pages.dashboard.noEventsRegistered')}
						subHeading={$_('user-pages.dashboard.noEventsRegisteredDetail')}
						buttonText={$_('common.viewEvents')}
						onButtonClick={()=> {}}
					/>
				{/if}
			</div>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>
</div>
