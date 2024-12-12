<script lang="ts">
	import { _ } from '@services';

	export let tabHeadings: readonly string[];
	export let activeTab: number;
	export let handleTabChange: (index: number) => void;
	export let hasBorder: boolean = true;

	const activeTabStyle = '  border-b-2 border-brand !text-brand';
</script>

<div class={`bg-white ${hasBorder ? 'border-b-2 border-stone-200' : ''}`}>
	<nav class="flex items-center justify-between">
		<div class="flex">
			{#each tabHeadings as tabHeading, index (tabHeading)}
				<button
					on:click={() => handleTabChange(index)}
					class={`text-stone-500 py-4 px-0 ${index === 0 ? 'mr-6' : 'mx-6'} block text-sm font-medium  focus:outline-none`.concat(
						index === activeTab ? activeTabStyle : ''
					)}
				>
					{$_(`tab-headings.${tabHeading}`)}
				</button>
			{/each}
		</div>
		<slot />
	</nav>
</div>
