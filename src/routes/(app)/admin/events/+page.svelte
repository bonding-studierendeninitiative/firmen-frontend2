<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _ } from '@services';
	import { PublishedEventsTab } from '@/@svelte/pages';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Pagination from '@/components/ui/pagination';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { ButtonIcon, NoDataFound, SearchInput } from '@/@svelte/components';
	import { GridIcon, ListIcon } from '@/@svelte/icons';
	import { blur } from 'svelte/transition';
	import EventStatusFilter from './event-status-filter.svelte';
	import { eventStatusFilters } from '@/stores';
	import { onMount } from 'svelte';

	export let data;

	const mapEvent = (event: {
		id: string;
		name: string;
		projectHSG: string;
		dateFrom: string | null;
		dateTo?: string | null;
		location: string;
	}) => {
		return {
			id: event.id,
			heading: event.name,
			subHeading: event.location,
			date: event.dateFrom
		};
	};
	let isListView = true;

	function resetFiltering() {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('status');
		params.delete('page');
		params.delete('sort');
		goto(`?${params}`);
	}

	$: {
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('status');
		$eventStatusFilters.forEach(status => params.append('status', status));
		goto(`?${params}`);
	}

	onMount(() => {
		$eventStatusFilters = $page.url.searchParams.getAll('status');
	})

</script>

<div class="space-y-6">
	<div class=" flex justify-between items-end">
		<div>
			<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('admin-pages.events.heading')}</h1>
			<h4 class=" text-stone-500">{$_('admin-pages.events.subHeading')}</h4>
		</div>
	</div>

	<section class=" mt-10 flex justify-between w-full">
		<SearchInput disabled placeholder={$_('common.search')} />
		<div class=" flex items-center justify-stretch gap-2">
			<EventStatusFilter />
			<ButtonIcon
				onClick={() => (isListView = false)}
				classes={`${!isListView ? '!text-brand' : ''}`}
			>
				<GridIcon />
			</ButtonIcon>
			<ButtonIcon onClick={() => (isListView = true)} classes={`${isListView ? '!text-brand' : ''}`}>
				<ListIcon />
			</ButtonIcon>
		</div>
	</section>
	{#await data.events}
		<LoaderCircle class=" w-16 h-16 mx-auto animate-spin" />
	{:then events }
		<section in:blur class="space-y-6">
			{#if events?.totalElements > 0}
				<PublishedEventsTab
					{isListView}
					publishedEvents={events?.data.map(mapEvent) ?? []}
					handleEventRegistration={id => goto(`/admin/events/${id}/registrations/`)}
					handleBuyOptions={id => goto(`/admin/events/${id}/buy-options/`)}
				/>
				<Pagination.Root class="mt-6" onPageChange={async (pageNumber) =>{
			const params = new URLSearchParams($page.url.searchParams);
			params.set('page', (pageNumber - 1).toString());
			await goto(`?${params}`); }
			} page={events?.page + 1} count={events?.totalElements} perPage={events?.size}
												 let:pages
												 let:currentPage>
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeft class="h-4 w-4" />
								<span class="hidden sm:block">{$_("common.previous")}</span>
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === "ellipsis"}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<span class="hidden sm:block">{$_("common.next")}</span>
								<ChevronRight class="h-4 w-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination.Root>
			{:else}
				<NoDataFound heading={$_('admin-pages.events.no-data-heading')}
										 subHeading={$_('admin-pages.events.no-data-message')}
										 buttonText="Suchfilter löschen" onButtonClick={resetFiltering} />
			{/if}
		</section>
	{:catch error}
		<div class=" text-center text-stone-500">
			{error.message}
		</div>
	{/await}
</div>
