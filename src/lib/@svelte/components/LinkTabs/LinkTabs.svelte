<script lang="ts">
	import { _ } from '@services';
	import { page } from '$app/stores';
	import { cn } from '@/utils';

	export let tabs: {
		name: string;
		href: string;
	}[];
	export let hasBorder: boolean = true;

	const activeTabStyle = '  border-b-2 border-brand !text-brand';
</script>

<div class={`bg-white ${hasBorder ? 'border-b-2 border-stone-200' : ''}`}>
	<nav class="flex items-center justify-between">
		<div class="flex">
			{#each tabs as tab, index (tab)}
				<a
					href={tab.href}
					class={
					cn(
						"text-stone-500 py-4 px-0 block text-sm font-medium focus:outline-none",
					index === 0 ? 'mr-6' : 'mx-6',
					$page.url.href.includes(tab.href) ? activeTabStyle : undefined,
					)}
				>
					{$_(`tab-headings.${tab.name}`)}
				</a>
			{/each}
		</div>
		<slot />
	</nav>
</div>
