<script lang="ts">
	import { _ } from '@services';

	export let tabs: {
		name: string;
		href: string;
	}[];
	export let activeTab: number;
	export let hasBorder: boolean = true;

	const activeTabStyle = '  border-b-2 border-brand !text-brand';
</script>

<div class={`bg-white ${hasBorder ? 'border-b-2 border-stone-200' : ''}`}>
	<nav class="flex items-center justify-between">
		<div class="flex">
			{#each tabs as tab, index (tab)}
				<a
					href={tab.href}
					class={`text-stone-500 py-4 px-0 ${index === 0 ? 'mr-6' : 'mx-6'} block text-sm font-medium  focus:outline-none`.concat(
						index === activeTab ? activeTabStyle : ''
					)}
				>
					{$_(`tab-headings.${tab.name}`)}
				</a>
			{/each}
		</div>
		<slot />
	</nav>
</div>
