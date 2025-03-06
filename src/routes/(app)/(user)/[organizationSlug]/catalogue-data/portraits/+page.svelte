<script lang="ts">
	import { _, dayjs } from '@services';
	import { Button, NoDataFound } from '@/@svelte/components';
	import { Button as ShadcnButton } from '@/components/ui/button';
	import { SimpleDocumentIcon } from '@/@svelte/icons';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { AddPortrait } from '@/@svelte/modules/AddPortrait';
	import { groupBy } from '@/utils/array';
	import { Pagination } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	const openDrawer = () => {
		isDrawerOpen = true;
	};
	const colors = ['#EA580C', '#EAB308', '#B91C1C', '#15803D', '#155E75', '#9D174D'];

	const gotoPreviousPage = (currentPage: number) => {
		if (currentPage && currentPage > 0) {
			goto(`?page=${currentPage - 1}`);
		}
	};
	const gotoNextPage = (currentPage: number, totalPages: number) => {
		if (currentPage !== undefined && currentPage < totalPages - 1) {
			goto(`?page=${currentPage + 1}`);
		}
	};

	let isDrawerOpen = false;
</script>

<div class="flex justify-between items-center">
	<div class="h-8 w-2/3 border-2 border-slate-400 rounded"></div>
	<ShadcnButton variant="gradient" on:click={openDrawer}
								class="m-0">{$_('user-pages.portraits.newPortrait')}</ShadcnButton>
</div>
{#await data.portraitTemplateData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin my-6" />
{:then portraitTemplateData}
	<section in:fade class="mt-4 flex flex-col gap-y-4">
		{#if portraitTemplateData?.portraitTemplates?.length < 1}
			<NoDataFound
				heading={$_('user-pages.portraits.noPortraitsFound')}
				subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
				buttonText={$_('user-pages.portraits.newPortrait')}
				onButtonClick={openDrawer}
			/>
		{:else}
			{@const groupedPortraits = groupBy(
				portraitTemplateData?.portraitTemplates,
				(portrait) => dayjs(portrait.lastModifiedAt).get('year') ?? '2024'
			)}
			{@const { enhance } = superForm(portraitTemplateData?.deleteForm)}
			{@const pages = new Array(portraitTemplateData?.portraitTemplatePageCount || 0).fill(0).map((_, index) => ({
				name: `${index + 1}`,
				href: `?page=${index}`,
				active: index === portraitTemplateData?.portraitTemplatePage
			}))}
			<div class="border-1 border-stone-400 rounded-xl p-6 grid grid-cols-3 gap-6">
				{#each Object.entries(groupedPortraits) as [group, portraitsOfThisGroup], index}
					<p class="col-span-3">{group}</p>
					{#each portraitsOfThisGroup as portrait}
						<form method="post" use:enhance>
							<div class=" flex flex-col justify-stretch items-stretch gap-4 mb-6">
								<div class="flex gap-4">
									<div
										style={`background-color:${colors[index % 6]} ;`}
										class={`rounded-lg inline-flex justify-center flex-shrink-0 items-center w-12 h-12`}
									>
										<SimpleDocumentIcon />
									</div>
									<div class=" flex flex-col">
										<h3 class=" text-balance text-base font-extrabold text-stone-800">
											{portrait.displayName}
										</h3>
										<h4 class=" text-sm font-normal text-stone-800">
											{$_('user-pages.portraits.portrait')} # {index + 1}
										</h4>
									</div>
								</div>
								<div class="flex gap-2">
									<a href={`/${data.initialState.orgSlug}/catalogue-data/portraits/${portrait.id}`}
										 class="content-center text-center font-extrabold px-4 py-1 space-x-4 rounded-lg text-stone-800 text-sm w-auto border border-solid border-slate-200 border-1 inline shadow-custom"
									>{$_('common.viewDetails')}</a>
									<input type="hidden" name="id" value={portrait.id} />
									<Button formaction="?/deletePortrait" onClick={() => {}}>{$_('common.delete')}</Button>
								</div>
							</div>
						</form>
					{/each}
				{/each}
			</div>
			<Pagination on:previous={() => gotoPreviousPage(portraitTemplateData?.portraitTemplatePage)}
									on:next={() => gotoNextPage(portraitTemplateData?.portraitTemplatePage, portraitTemplateData?.portraitTemplatePageCount)}
									large {pages} />
		{/if}
	</section>
{:catch error}
	<p>{error.message}</p>
{/await}
{#await data.form}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then form}
	<AddPortrait validated={form} bind:isOpen={isDrawerOpen} />
{:catch error}
	<p>{error.message}</p>
{/await}