<script lang="ts">
	import { NoDataFound } from '@/@svelte/components';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { UploadLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { _, dayjs } from '@services/i18n';
	import { derived } from 'svelte/store';
	import LogoItem from './logo-item.svelte';
	export let data;
	let isUploadOpen = false;

	const api = trpc($page);

	const [logos, resolveLogos] =
		api.catalogueData.getAll.createInfiniteQuery(
			{ limit: '10', documentType: "logo" },
			{
				getNextPageParam: (lastPage) => Math.max(Number(lastPage.pageNumber) + 1, Number(lastPage.totalPages) - 1).toString(),
				lazy: true
			}
		);

	const allLogos = derived(logos, (logos) => {
		return logos.data?.pages.flatMap((page) => page.documents) ?? []
	})

	const groupedLogos = derived(allLogos, (allLogos)=> {
		return allLogos.reduce((acc, logo) => {
					const year = dayjs(logo?.activeVersion?.createdAt).year();

					if (!acc[year]) {
						acc[year] = [];
					}
					acc[year].push(logo);
					return acc;
				}, {})
	})

	const uploadFormQuery = api.catalogueData.uploadForm.createQuery(undefined, {
		staleTime: Infinity
	});

	const uploadForm = $uploadFormQuery.data;
</script>

<div in:fade class="space-y-4">
	<div class="flex justify-end">
		{#if $uploadFormQuery.isLoading}
			<Button class="min-w-32 mr-2" disabled>
				<LoaderCircle class="w-5 h-5 mx-auto animate-spin" />
			</Button>
		{:else if $uploadFormQuery.data}
			<UploadLogoDialog bind:open={isUploadOpen} logoUploadForm={$uploadFormQuery.data} />
		{/if}
	</div>
	{#await resolveLogos(data.data)}
		<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
	{:then _ignored}
		{#if $logos.data}
			{#if $allLogos.length < 1}
				<NoDataFound heading="No logos found" subHeading="You can add logos to your organization" buttonText="Add logo"
										 onButtonClick={() => {
isUploadOpen = true;
		}} />
			{:else}
				<div in:fade class="space-y-8">
					{#each Object.entries($groupedLogos || {}).sort(([ayear, alogos], [byear, blogos]) => byear.localeCompare(ayear)) as [year, logos] (year)}
						<div class="space-y-4 py-2 @container/logos">
							<h2 class="text-xl font-bold border-b">{year}</h2>
							<div class="grid grid-cols-1 @lg/logos:grid-cols-2 @3xl/logos:grid-cols-3 @5xl/logos:grid-cols-4 gap-6">
								{#each logos as logo (logo.id)}
									<LogoItem {logo} />
								{/each}
							</div>
						</div>
					{/each}
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
</div>
