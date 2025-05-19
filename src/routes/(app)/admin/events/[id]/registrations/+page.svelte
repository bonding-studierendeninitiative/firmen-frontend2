<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import DataTable from './data-table.svelte';

	export let data;

	const api = trpc($page);

	const [eventRegistrationsQuery, resolveEventRegistrations] =
		api.admin.events.getEventRegistrations.createInfiniteQuery(
			{
				limit: 10,
				eventId: $page.params.id
			},
			{
				getNextPageParam: (lastPage) =>
					Math.max(Number(lastPage.pageNumber) + 1, Number(lastPage.totalPages) - 1),
				lazy: true
			}
		);

	const allEventRegistrations = derived(eventRegistrationsQuery, (query)=> query.data?.pages.flatMap(
		(page) => page.eventRegistrations ?? []
	) ?? [])
</script>

{#await resolveEventRegistrations(data.tableData)}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then ignored}
	<section in:fade class=" mt-6">
		{#if !allEventRegistrations}
			<section class=" mt-10">
				<NoDataFound
					heading={$_('admin-pages.events.noRegistrationsFound')}
					subHeading={$_('admin-pages.events.noDataToDisplay')}
					buttonText={$_('admin-pages.events.backToEvents')}
					onButtonClick={() => {}}
				/>
			</section>
		{:else}
			<section class=" mt-10">
				<DataTable data={allEventRegistrations} />
			</section>
		{/if}
	</section>
{:catch error}
	<p>{error.message}</p>
{/await}
