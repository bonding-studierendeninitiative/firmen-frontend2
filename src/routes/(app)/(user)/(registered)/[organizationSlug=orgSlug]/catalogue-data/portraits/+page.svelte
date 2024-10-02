<script lang="ts">
	import { _ } from '@services';
	import { Button, NoDataFound } from '@/@svelte/components';
	import { Button as ShadcnButton } from '@/components/ui/button';
	import { SimpleDocumentIcon } from '@/@svelte/icons';
	import { goto } from '$app/navigation';
	import { currentOrganization } from '@/stores/organizationStore';
	import dayjs from 'dayjs';
	import type {
		PageData
	} from './$types';
	import { AddPortrait } from '@/@svelte/modules/AddPortrait';
	import { groupBy } from '@/utils/array';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Pagination } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	dayjs.extend(relativeTime);

	export let data: PageData;

	const openDrawer = () => {
		isDrawerOpen = true;
	};
	const colors = ['#EA580C', '#EAB308', '#B91C1C', '#15803D', '#155E75', '#9D174D'];

	$: portraits = data.portraitTemplates || [];
	$: groupedPortraits = groupBy(portraits, (portrait) => dayjs(portrait.lastModifiedAt).get('year') ?? '2024-01-01');
	$: page = data.portraitTemplatePage || 0;
	$: totalPages = data.portraitTemplatePageCount || 0;
	$: pages = new Array(totalPages || 0).fill(0).map((_, index) => ({
		name: `${index + 1}`,
		href: `?page=${index}`,
		active: index === page
	}));

	const gotoPreviousPage = () => {
		if (page && page > 0) {
			goto(`?page=${page - 1}`);
		}
	};
	const gotoNextPage = () => {
		if (page !== undefined && page < totalPages - 1) {
			goto(`?page=${page + 1}`);
		}
	};

	const { enhance } = superForm(data.deleteForm);

	let isDrawerOpen = false;
</script>

<div class="flex justify-between items-center">
	<div class="h-8 w-2/3 border-2 border-slate-400 rounded"></div>
	<ShadcnButton variant="gradient" on:click={openDrawer} class="m-0">{$_('user-pages.portraits.newPortrait')}</ShadcnButton>
</div>
{#if portraits.length < 1}
	<section class=" mt-4">
		<NoDataFound
			heading={$_('user-pages.portraits.noPortraitsFound')}
			subHeading={$_('user-pages.portraits.noPortraitsFoundDescription')}
			buttonText={$_('user-pages.portraits.newPortrait')}
			onButtonClick={openDrawer}
		/>
	</section>
{:else}
	<section class="mt-4 flex flex-col gap-y-4">
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
									<h3 class=" text-balance text-base font-extrabold text-stone-800">{portrait.displayName}</h3>
									<h4 class=" text-sm font-normal text-stone-800">
										{$_('user-pages.portraits.portrait')} # {index + 1}
									</h4>
								</div>
							</div>
							<div class="flex gap-2">
								<a href={`/${$currentOrganization?.organizationSlug}/catalogue-data/portraits/${portrait.id}`}
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
		<Pagination on:previous={gotoPreviousPage} on:next={gotoNextPage} large {pages} />
	</section>
{/if}
<AddPortrait validated={data.form} bind:isOpen={isDrawerOpen} />