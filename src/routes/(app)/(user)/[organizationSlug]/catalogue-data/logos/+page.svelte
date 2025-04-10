<script lang="ts">
	import { LogoItem, NoDataFound } from '@/@svelte/components';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { UploadLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let data;
	let isUploadOpen = false;

	const api = trpc($page);
	const utils = api.createUtils();

	const [logos, resolveLogos] =
		api.catalogueData.logos.getAll.createInfiniteQuery(
			{ cursor: $page.url.searchParams.get('page') || '0' },
			{
				getNextPageParam: (lastPage) => Math.max(lastPage.pageNumber + 1, lastPage.totalPages - 1),
				lazy: true
			}
		);
</script>

{#await resolveLogos(data.data)}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then _ignored}
	<div class="flex justify-end">
		<Button class="mr-2" on:click={() => {isUploadOpen = true;}}>
			<Plus class="h-4 w-4 mr-2" />
			Upload a logo
		</Button>
	</div>
	<UploadLogoDialog bind:open={isUploadOpen} logoUploadForm={data?.uploadForm} />
	{#if $logos.data}
		{#if !$logos.data?.pages?.length}
			<NoDataFound heading="No logos found" subHeading="You can add logos to your organization" buttonText="Add logo"
									 onButtonClick={() => {
isUploadOpen = true;
		}} />
		{:else}
			<div in:fade class="space-y-4 @container/logos">
				<div class="grid grid-cols-1 @lg/logos:grid-cols-2 @3xl/logos:grid-cols-3 @5xl/logos:grid-cols-4 gap-6">
					{#each $logos.data.pages.flatMap((page) => page.logos) as logo}
						<LogoItem {logo} />
					{/each}
				</div>
			</div>
		{/if}
	{/if}
	{#if $logos.isPending || $logos.isFetching}
		<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
	{:else if $logos.isError}
		<article>
			Error loading logos: {$logos.error}
		</article>
	{/if}
{/await}
<!--<div in:fade>
	{#if !$logos.data?.logos?.length}
		<NoDataFound heading="No logos found" subHeading="You can add logos to your organization" buttonText="Add logo"
								 onButtonClick={() => {
isUploadOpen = true;
		}} />
	{:else }
		{@const groupedLogos = data?.data.logos?.reduce((acc, logo) => {
			const year = dayjs().year();

			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(logo);
			return acc;
		}, {})}
		<div class="flex justify-end">
			<Button class="mr-2" on:click={() => {isUploadOpen = true;}}>
				<Plus class="h-4 w-4 mr-2" />
				Upload a logo
			</Button>
		</div>
		{#each Object.entries(groupedLogos || {}) as [year, logos]}
			<div class="space-y-4 @container/logos">
				<h2 class="text-xl font-bold border-b">{year}</h2>
				<div class="grid grid-cols-1 @lg/logos:grid-cols-2 @3xl/logos:grid-cols-3 @5xl/logos:grid-cols-4 gap-6">
					{#each logos as logo}
						<LogoItem {logo} />
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
<UploadLogoDialog bind:open={isUploadOpen} logoUploadForm={data?.uploadForm} />-->
