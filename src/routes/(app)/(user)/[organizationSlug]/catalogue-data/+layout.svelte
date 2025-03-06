<script lang="ts">
	import { _ } from '@services';
	import { LinkTabs } from '@/@svelte/components';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: tabs = [
		{
			name: 'catalogue-data-portraits',
			href: `/${data.initialState.orgSlug}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${data.initialState.orgSlug}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${data.initialState.orgSlug}/catalogue-data/adverts`
		}
	];
</script>

<div class="w-full h-full flex flex-col justify-start items-stretch min-h-max">
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.portraits.portraits')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.portraits.portraitsSubHeading')}</h4>
	<div class=" mt-6">
		<LinkTabs {tabs} />
	</div>
	<section class="flex-grow mt-6">
		<div in:fade>
			<slot />
		</div>
	</section>
</div>
