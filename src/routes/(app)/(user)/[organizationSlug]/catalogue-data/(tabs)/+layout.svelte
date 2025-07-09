<script lang="ts">
	import { _ } from '@services';
	import { LinkTabs } from '@/@svelte/components';
	import { fade } from 'svelte/transition';
	import { source } from 'sveltekit-sse';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';

	let { data, children } = $props();

	let tabs = $derived([
		{
			name: 'catalogue-data-portraits',
			href: `/${data.orgSlug}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${data.orgSlug}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${data.orgSlug}/catalogue-data/adverts`
		}
	]);

	const api = trpc(page);
	const utils = api.createUtils();

	source('_api/events')
		.select('catalogue-data-event')
		.json()
		.subscribe(async (catalogueDataEvent) => {
			if (!catalogueDataEvent) {
				console.log("catalogueDataEvent is null")
				return;
			}
			if (!catalogueDataEvent.documentId || typeof catalogueDataEvent.documentId !== 'string') {
				console.log("catalogueDataEvent is missing documentId")
				return;
			}
			if (catalogueDataEvent.documentType === 'logo') {
				await utils.catalogueData.getAll.invalidate({documentType: "logo"})
				await invalidate("orgLogos")
			} else if (catalogueDataEvent.documentType === 'advert') {
				await utils.catalogueData.getAll.invalidate({documentType: "advert"})
				await invalidate("orgAdverts")
			}
		});
</script>

<div class="size-full flex flex-col justify-start items-stretch min-h-max">
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.portraits.portraits')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.portraits.portraitsSubHeading')}</h4>
	<div class=" mt-6">
		<LinkTabs {tabs} />
	</div>
	<section class="grow mt-6">
		<div in:fade>
			{@render children?.()}
		</div>
	</section>
</div>
