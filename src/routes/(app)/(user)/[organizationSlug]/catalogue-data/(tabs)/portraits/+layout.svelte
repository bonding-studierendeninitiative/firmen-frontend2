<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound, PortraitCard, SearchInput } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { PortraitForm } from '@/@svelte/modules/PortraitForm';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import * as Pagination from '@/components/ui/pagination';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { queryParameters } from 'sveltekit-search-params';

	let { data, children } = $props();

	let searchValue = $state('');

	let timeout: string | number | NodeJS.Timeout | null = $state(null);

	let params = queryParameters({
		filter: false,
		create: false,
		page: false
	})

	$effect(() => {
		if (!(searchValue === '' && $params.filter === null)) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(async () => {
				$params.filter = searchValue
			}, 600);
		}
	});

	let isDrawerOpen = $derived($params.create !== null);

	const createNewDialog = () => {
		$params.create = 'true'
	};

	const handleDialogChange = (open: boolean) => {
		if (open) return;

		console.log("Protrait closed in Layout");
		

		$params.create = null
	};
</script>

<div class="flex justify-between items-center gap-4">
	<SearchInput placeholder={$_('common.search')} bind:value={searchValue} />
	<Button variant="default" onclick={createNewDialog} class="m-0"
		>{$_('user-pages.portraits.newPortrait')}</Button
	>
</div>
{#await data.portraitTemplateData}
	<LoaderCircle class="size-10 mx-auto animate-spin my-6" />
{:then portraitTemplateData}
	<section in:fade class="mt-4 flex flex-col gap-y-4 @container/portraits">
		{#if (portraitTemplateData?.portraitTemplates?.length ?? 0) < 1}
			<NoDataFound
				heading={$_('user-pages.portraits.noPortraitsFound')}
				subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
				buttonText={$_('user-pages.portraits.newPortrait')}
				onButtonClick={() => ($params.create = 'true')}
			/>
		{:else}
			<div class="grid grid-cols-1 @3xl/portraits:grid-cols-2 @5xl/portraits:grid-cols-3 @7xl/portraits:grid-cols-4 gap-6">
				{#each portraitTemplateData?.portraitTemplates ?? [] as portrait}
					<PortraitCard {portrait} />
				{/each}
			</div>
			<Pagination.Root
				perPage={10}
				page={(portraitTemplateData?.pageNumber ?? 0) + 1}
				count={portraitTemplateData?.totalElements}
				onPageChange={(pageNumber) => {
					$params.page = String(pageNumber - 1)
				}}
			>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeft class="size-4" />
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
								<ChevronRight class="size-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		{/if}
	</section>
{:catch error}
	<p>{error.message}</p>
{/await}

{@render children?.()}

{#await data.createForm then createForm}
	<PortraitForm
		validated={createForm}
		isOpen={isDrawerOpen}
		onDialogChange={handleDialogChange}
	/>
{:catch error}
	<p>{error.message}</p>
{/await}
