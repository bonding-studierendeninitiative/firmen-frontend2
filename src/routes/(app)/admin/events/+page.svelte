<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { _ } from '@services';
	import { PublishedEventsTab } from '@/@svelte/pages';
	import { LoaderCircle } from '@lucide/svelte';
	import * as Pagination from '@/components/ui/pagination';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { ButtonIcon, NoDataFound, SearchInput } from '@/@svelte/components';
	import { GridIcon, ListIcon } from '@/@svelte/icons';
	import { blur } from 'svelte/transition';
	import EventStatusFilter from './event-status-filter.svelte';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import { fade } from 'svelte/transition';
	import { getEvents } from '@/remote/functions/admin';

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
	let isListView = $state(true);

	let params = queryParameters(
		{
			status: ssp.array<string>(),
			page: ssp.number(),
			size: ssp.number()
		},
		{
			showDefaults: false
		}
	);

	let eventsFilter = $derived.by(() => ({
		status: params.status?.length ? params.status : ['PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'],
		page: params.page ?? 0,
		size: params.size ?? 10,
		sortBy: 'dateFrom',
		sortDirection: 'desc'
	}));

	let eventsQuery = $derived(getEvents(eventsFilter));

	function resetFiltering() {
		params.status = null;
		params.page = null;
		params.size = null;
	}
</script>

<div in:fade class="space-y-6">
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
				classes={`${!isListView ? 'text-brand!' : ''}`}
			>
				<GridIcon />
			</ButtonIcon>
			<ButtonIcon
				onClick={() => (isListView = true)}
				classes={`${isListView ? 'text-brand!' : ''}`}
			>
				<ListIcon />
			</ButtonIcon>
		</div>
	</section>
	{#if eventsQuery.loading}
		<LoaderCircle class=" size-16 mx-auto animate-spin" />
	{:else if eventsQuery.current}
		<section in:blur class="space-y-6">
			{#if Number(eventsQuery.current?.totalElements) > 0}
				<PublishedEventsTab
					{isListView}
					publishedEvents={eventsQuery.current?.data?.map(mapEvent) ?? []}
					handleEventRegistration={(id) => goto(`/admin/events/${id}/registrations/`)}
					handleBuyOptions={(id) => goto(`/admin/events/${id}/buy-options/`)}
				/>
				<Pagination.Root
					class="mt-6"
					onPageChange={async (pageNumber) => {
						const params = new URLSearchParams(page.url.searchParams);
						params.set('page', (pageNumber - 1).toString());
						await goto(`?${params}`);
					}}
					page={Number(eventsQuery.current?.page) + 1}
					count={Number(eventsQuery.current?.totalElements)}
					perPage={eventsQuery.current?.size}
				>
					{#snippet children({ pages, currentPage })}
						<Pagination.Content>
							<Pagination.Item>
								<Pagination.PrevButton>
									<ChevronLeft class="size-4" />
									<span class="hidden sm:block">{$_('common.previous')}</span>
								</Pagination.PrevButton>
							</Pagination.Item>
							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
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
									<span class="hidden sm:block">{$_('common.next')}</span>
									<ChevronRight class="size-4" />
								</Pagination.NextButton>
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			{:else}
				<NoDataFound
					heading={$_('admin-pages.events.no-data-heading')}
					subHeading={$_('admin-pages.events.no-data-message')}
					buttonText="Suchfilter löschen"
					onButtonClick={resetFiltering}
				/>
			{/if}
		</section>
	{/if}
</div>
