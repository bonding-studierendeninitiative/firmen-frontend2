<script lang="ts">
	import * as Sheet from '@/components/ui/sheet';
	import * as Pagination from '@/components/ui/pagination';
	import * as Tabs from '@/components/ui/tabs';
	import { ClipboardList, LoaderCircle } from '@lucide/svelte';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';
	import { getJobs } from '@/trpc/routers/admin';

	let stateName: 'SUCCEEDED' | 'FAILED' | 'PROCESSING' | 'ENQUEUED' | 'SCHEDULED' | 'DELETED' =
		$state('SUCCEEDED');
	let limit = $state('10');
	let offset = $state('0');
	let filter = $derived.by(() => ({ stateName, limit, offset }));
</script>

<Sheet.Root>
	<Sheet.Trigger class={cn(buttonVariants({ variant: 'ghost' }))}>
		<ClipboardList class="size-6" />
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col gap-4">
		<Sheet.Header class="space-y-4">
			<Sheet.Title class="inline-flex items-center gap-2">
				<ClipboardList class="size-6" />
				Jobs
			</Sheet.Title>
			<Tabs.Root bind:value={stateName}>
				<Tabs.List class="flex-col h-full">
					<Tabs.Trigger class="w-full" value="SUCCEEDED">Succeeded</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="FAILED">Failed</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="PROCESSING">Processing</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="ENQUEUED">Enqueued</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="SCHEDULED">Scheduled</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="DELETED">Deleted</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
		</Sheet.Header>
		{#if getJobs(filter).loading}
			<LoaderCircle class="mx-auto size-5 animate-spin" />
		{/if}
		<div class="grow">
			{#each getJobs(filter).current?.jobs ?? [] as job}
				<p>{job.name}</p>
			{/each}
		</div>
		<Pagination.Root
			onPageChange={(page) => {
				offset = String(page * Number(limit ?? 0));
			}}
			count={getJobs(filter).current?.total ?? 0}
			perPage={getJobs(filter).current?.limit ?? 10}
		>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</Sheet.Content>
</Sheet.Root>
