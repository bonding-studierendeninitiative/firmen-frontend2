<script lang="ts">
	import { _ } from '@services';

	interface Props {
		tabHeadings: readonly string[];
		activeTab: number;
		handleTabChange: (index: number) => void;
		hasBorder?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		tabHeadings,
		activeTab,
		handleTabChange,
		hasBorder = true,
		children
	}: Props = $props();

	const activeTabStyle = '  border-b-2 border-brand !text-brand';
</script>

<div class={`bg-white ${hasBorder ? 'border-b-2 border-stone-200' : ''}`}>
	<nav class="flex items-center justify-between">
		<div class="flex">
			{#each tabHeadings as tabHeading, index (tabHeading)}
				<button
					onclick={() => handleTabChange(index)}
					class={`text-stone-500 py-4 px-0 ${index === 0 ? 'mr-6' : 'mx-6'} block text-sm font-medium  focus:outline-none`.concat(
						index === activeTab ? activeTabStyle : ''
					)}
				>
					{$_(`tab-headings.${tabHeading}`)}
				</button>
			{/each}
		</div>
		{@render children?.()}
	</nav>
</div>
