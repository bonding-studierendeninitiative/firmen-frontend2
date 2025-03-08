<script lang="ts">
	import { _, dayjs } from '@services';
	import { NoDataFound, PortraitCard, SearchInput } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { SimpleDocumentIcon } from '@/@svelte/icons';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { AddPortrait } from '@/@svelte/modules/AddPortrait';
	import { groupBy } from '@/utils/array';
	import { Pagination } from 'flowbite-svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
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

	<SearchInput
		placeholder={$_('common.search')}
	/>
	<Button variant="default" on:click={openDrawer}
								class="m-0">{$_('user-pages.portraits.newPortrait')}</Button>
</div>
{#await data.portraitTemplateData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin my-6" />
{:then portraitTemplateData}
	<SuperDebug data={portraitTemplateData} />
	<section in:fade class="mt-4 flex flex-col gap-y-4">
		{#if portraitTemplateData?.portraitTemplates?.length < 1}
			<NoDataFound
				heading={$_('user-pages.portraits.noPortraitsFound')}
				subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
				buttonText={$_('user-pages.portraits.newPortrait')}
				onButtonClick={openDrawer}
			/>
		{:else}
			<div class="grid grid-cols-3 gap-6">
					{#each portraitTemplateData?.portraitTemplates as portrait}
						<PortraitCard portrait={portrait} deletePortraitForm={portraitTemplateData?.deleteForm}/>
					{/each}
			</div>
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