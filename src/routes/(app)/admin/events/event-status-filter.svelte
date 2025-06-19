<script lang="ts">

	import { Check, Filter, X } from '@lucide/svelte';

	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
	import { Badge } from '@/components/ui/badge';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { queryParameters, ssp } from 'sveltekit-search-params';

	type Status = 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'

	const clearFilters = () => {
		$params.status = [];
	};

	const params = queryParameters({
		status: ssp.array<string>([])
	})

	const getStatusColor = (status: Status) => {
		switch (status) {
			case 'PUBLISHED':
				return 'data-[state=on]:bg-green-200 data-[state=on]:text-green-900';
			case 'UNPUBLISHED':
				return 'data-[state=on]:bg-amber-200 data-[state=on]:text-amber-900';
			case 'ARCHIVED':
				return 'data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900';
		}
	};

</script>
<Popover.Root>
	<Popover.Trigger class={cn(buttonVariants({variant: 'outline', size: 'sm'}), 'border-dashed h-full px-4 mr-2')}>
		<Filter class="mr-2 size-4" />
		{$_("components.event-status-filter.label")}
		{#if Number($params.status?.length) > 0}
			<Badge variant="secondary" class="ml-2 rounded-sm px-1 font-normal">
				{$params.status?.length}
			</Badge>
		{/if}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-4 mt-2" align="start">
		<div class="space-y-2">
			<h4 class="font-medium text-sm">{$_("components.event-status-filter.heading")}</h4>
			<ToggleGroup
				type="multiple"
				variant="outline"
				class="flex flex-wrap gap-2"
				bind:value={$params.status}
			>
				{#each ["published", "unpublished", "archived"] as status}
					<ToggleGroupItem
						value={status}
						class={`lowercase rounded-full ${getStatusColor(status)}`}
						aria-label={`Filter by ${status} status`}
					>
						{#if $params.status?.includes(status)}
							<Check class="size-4 mr-2" />
						{/if}
						{$_(`common.event-status.${status.toLowerCase()}`)}
					</ToggleGroupItem>
				{/each}
			</ToggleGroup>
			{#if Number($params.status?.length) > 0}
				<Button
					variant="ghost"
					size="sm"
					class="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
					onclick={clearFilters}
				>
					{$_("components.event-status-filter.clear")}
					<X class="ml-1 size-3" />
				</Button>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
