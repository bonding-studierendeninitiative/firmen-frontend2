<script lang="ts">
	import { goto } from '$app/navigation';
	import { CreateBuyOption } from '@/@svelte/modules';
	import { _ } from '@services';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { createBuyOption, getBuyOptions } from '@/remote/functions/admin';
	import * as Tabs from '@/components/ui/tabs';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';

	let { children, params } = $props();

	let isDialogOpen = writable(false);
	setContext('isCreateBuyOptionDialogOpen', isDialogOpen);

	let buyOptionsFilter = $derived.by(() => ({
		eventId: params.id,
		page: 0,
		limit: 10,
		sortBy: 'creationDate',
		sortDirection: 'desc'
	}));

	let getBuyOptionsQuery = $derived(getBuyOptions(buyOptionsFilter));
</script>

<section in:fade class="mt-6 grid gap-6">
	<nav class="flex gap-x-4">
		{#each getBuyOptionsQuery.current?.buyOptions ?? [] as option (option.id)}
			<a href={`/admin/events/${params.id}/buy-options/${option.id}`}>
				<Button variant="outline" value={option.id!}>
					{option.name ?? $_('modules.buy-option-selector.unnamed')}
				</Button>
			</a>
		{:else}
			<Button variant="outline" disabled>
				<Skeleton class="bg-secondary-foreground w-24 h-4" />
			</Button>
			<Button variant="outline" disabled>
				<Skeleton class="bg-secondary-foreground w-24 h-4" />
			</Button>
			<Button variant="outline" disabled>
				<Skeleton class="bg-secondary-foreground w-24 h-4" />
			</Button>
		{/each}
		<CreateBuyOption
			bind:isDialogOpen={$isDialogOpen}
			onCreateBuyOption={async ({ submit }) => {
				await submit().updates(getBuyOptionsQuery);
				if (createBuyOption.result) {
					await goto(`/admin/events/${params.id}/buy-options/${createBuyOption.result.id}`);
					toast.success($_('modules.create-buy-option.success'));
				} else {
					throw new Error('Create buy option failed');
				}
			}}
		/>
	</nav>

	{@render children?.()}
</section>
