<script lang="ts">
	import { _, dayjs } from '@services';
	import { page } from '$app/stores';
	import { NoDataFound, PortraitCard, SearchInput } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { PortraitForm } from '@/@svelte/modules/PortraitForm';
	import SuperDebug from 'sveltekit-superforms';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import * as Pagination  from "@/components/ui/pagination"
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	export let data: PageData;

	let searchValue = ""

	let timeout: unknown | null = null;

	$: {
		if (!(searchValue === '' && $page.url.searchParams.get('filter') === null)) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(async () => {
					const q = new URLSearchParams($page.url.searchParams);
					q.set('filter', searchValue);
					goto(`?${q}`, { noScroll: true });
				}, 600
			);
		}
	}

	$: isDrawerOpen = $page.url.searchParams.get('create') !== null || $page.url.searchParams.get('edit') !== null;




	const createNewDialog = () => {
		const q = new URLSearchParams($page.url.searchParams);
		q.set("create", "true")
		goto(`?${q}`, { noScroll: true });
	}

	const handleDialogChange = (open: boolean) => {
		if (open) return;

		const q = new URLSearchParams($page.url.searchParams);
		q.delete("edit")
		q.delete("create")
		goto(`?${q}`);
	}


</script>
<div class="flex justify-between items-center">

	<SearchInput
		placeholder={$_('common.search')}
		bind:value={searchValue}
	/>
	<Button variant="default" on:click={createNewDialog}
								class="m-0">{$_('user-pages.portraits.newPortrait')}</Button>
</div>
{#await data.portraitTemplateData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin my-6" />
{:then portraitTemplateData}
	<section in:fade class="mt-4 flex flex-col gap-y-4">
		{#if portraitTemplateData?.portraits.portraitTemplates?.length < 1}
			<NoDataFound
				heading={$_('user-pages.portraits.noPortraitsFound')}
				subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
				buttonText={$_('user-pages.portraits.newPortrait')}
				onButtonClick={() => isDrawerOpen = true}
			/>
		{:else}
			<div class="grid grid-cols-3 gap-6">
					{#each portraitTemplateData?.portraits.portraitTemplates as portrait}
						<PortraitCard portrait={portrait} deletePortraitForm={portraitTemplateData?.deleteForm}/>
					{/each}
			</div>
			<Pagination.Root perPage={10} page={portraitTemplateData?.portraits.pageNumber + 1} count={portraitTemplateData?.portraits.totalElements} let:pages let:currentPage onPageChange={(pageNumber) => {
				const p = new URLSearchParams($page.url.searchParams);
				p.set("page", String(pageNumber-1))
			 	goto(`?${p}`, {noScroll: true})

			}}>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="h-4 w-4" />
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
							<ChevronRight class="h-4 w-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>

		{/if}
	</section>

{:catch error}
	<p>{error.message}</p>
{/await}
{#await data.portraitDetails}
{:then portraitDetails}
	<PortraitForm validated={portraitDetails?.createForm} bind:isOpen={isDrawerOpen} onDialogChange={handleDialogChange} />
{:catch error}
	<p>{error.message}</p>
{/await}