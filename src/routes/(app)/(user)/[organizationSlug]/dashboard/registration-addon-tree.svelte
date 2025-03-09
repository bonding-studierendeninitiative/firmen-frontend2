<script lang="ts">
	import { CheckCircle2 } from 'lucide-svelte';
	import X from 'lucide-svelte/icons/x';

	export let addons = [];
</script>

<ul class='space-y-1 text-sm'>
	{#each addons as addon}
		<li class='space-y-1'>
			<div class='flex items-center'>
				{#if addon.selected}

					<CheckCircle2 class='h-4 w-4 text-green-500 mr-2'
					/>
				{:else}
					<X class='h-4 w-4 text-muted-foreground mr-2'
					/>
				{/if}
				<span class={addon.selected ? 'font-medium' : 'text-muted-foreground'}> {addon.title} </span>
			</div>
			{#if addon.addons && addon.addons.length > 0 }
				<ul class='pl-6 space-y-1 mt-1'>
					<svelte:self addons={addon.addons} />
				</ul>
			{/if}
		</li>
	{/each}
</ul>