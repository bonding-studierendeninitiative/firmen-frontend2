<script lang="ts">
	import { _ } from '@services';
	import { LinkTabs, Spinner } from '@/@svelte/components';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	$: tabs = [
		{
			name: 'catalogue-data-portraits',
			href: `/${$currentOrganizationSlugStore}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${$currentOrganizationSlugStore}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${$currentOrganizationSlugStore}/catalogue-data/adverts`
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
		{#if $navigating?.to?.url.pathname.includes('/catalogue-data/')}
			<div class="grid justify-center items-center h-full text-orange-400">
				<Spinner color="red" />
			</div>
		{:else}
			<div in:fade>
				<slot />
			</div>
		{/if}
	</section>
</div>
