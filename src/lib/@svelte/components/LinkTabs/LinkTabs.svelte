<script lang="ts">
	import { _ } from '@services';
	import { page } from '$app/state';
	import { cn } from '@/utils/tailwind';

	interface Props {
		tabs: {
			name: string;
			href: string;
		}[];
		hasBorder?: boolean;
		children?: import('svelte').Snippet;
	}

	let { tabs, hasBorder = true, children }: Props = $props();

	const activeTabStyle = '  border-b-2 border-brand !text-brand';
</script>

<div class={`bg-white ${hasBorder ? 'border-b-2 border-stone-200' : ''}`}>
	<nav class="flex items-center justify-between">
		<div class="flex">
			{#each tabs as tab, index (tab)}
				<a
					href={tab.href}
					class={cn(
						'text-stone-500 py-4 px-0 block text-sm font-medium focus:outline-none',
						index === 0 ? 'mr-6' : 'mx-6',
						page.url.href.includes(tab.href) ? activeTabStyle : undefined
					)}
				>
					{$_(`tab-headings.${tab.name}`)}
				</a>
			{/each}
		</div>
		{@render children?.()}
	</nav>
</div>
