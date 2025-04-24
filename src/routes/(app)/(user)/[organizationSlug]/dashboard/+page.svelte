<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import type { PageData } from './$types';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import RegistrationCard from './registration-card.svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let data: PageData;

	const api = trpc($page);

	const [eventRegistrationsQuery, resolveEventRegistrationsQuery] = api.eventRegistrations.forOrganization.createInfiniteQuery(
		{ limit: '10' },
		{
			getNextPageParam: (lastPage) => Math.max(lastPage.pageNumber + 1, lastPage.totalPages - 1).toString(),
			lazy: true
		}
	);
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
				{$_('user-pages.dashboard.registeredEvents')}
			</h2>
		</div>
		{#await resolveEventRegistrationsQuery(data.eventRegistrations)}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then _ignored}
			{@const allEventRegistrations = $eventRegistrationsQuery?.data?.pages.flatMap(page => page.eventRegistrations) ?? []}
			<div in:fade class="mt-2 @container/registrations">
				{#if allEventRegistrations.length > 0 }
					<div class="grid grid-cols-1 @4xl/registrations:grid-cols-2 gap-8 items-start">
						{#each allEventRegistrations as eventRegistration, index}
							<RegistrationCard registration={eventRegistration}
							/>
						{/each}
					</div>
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
