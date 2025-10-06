<script lang="ts">
	import { cn } from '$lib/utils';

	interface Tab {
		title: string;
		value: string;
		content: any;
	}

	interface Props {
		tabs: Tab[];
		defaultValue?: string;
		class?: string;
	}

	let { tabs, defaultValue, class: className }: Props = $props();

	let activeTab = $state(defaultValue || tabs[0]?.value);

	function handleTabChange(value: string) {
		activeTab = value;
	}

	const activeTabContent = $derived(tabs.find((tab) => tab.value === activeTab)?.content);
</script>

<div class={cn('w-full', className)}>
	<div class="flex space-x-1 rounded-lg bg-muted p-1">
		{#each tabs as tab}
			<button
				type="button"
				class={cn(
					'w-full rounded-md py-2 px-3 text-sm font-medium transition-all',
					'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
					activeTab === tab.value
						? 'bg-background text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'
				)}
				onclick={() => handleTabChange(tab.value)}
			>
				{tab.title}
			</button>
		{/each}
	</div>
	<div class="mt-4">
		{#if activeTabContent}
			{@render activeTabContent()}
		{/if}
	</div>
</div>
