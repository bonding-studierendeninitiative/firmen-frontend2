<script lang="ts">
	import * as Sheet from '@/components/ui/sheet';
	import * as Pagination from '@/components/ui/pagination';
	import * as Tabs from '@/components/ui/tabs';
	import type { InferOutput } from 'valibot';
	import type { Jobs } from '@schema';
	import { trpc } from '@/trpc/client';
	import { derived, writable } from 'svelte/store';
	import { page } from '$app/state';
	import { ClipboardList, LoaderCircle } from '@lucide/svelte';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';

	interface Props {
		initialData: InferOutput<Jobs>;
	}

	let { initialData }: Props = $props();

	const api = trpc(page);
	const state = writable<'SUCCEEDED' | 'FAILED' | 'PROCESSING' | 'ENQUEUED' | 'SCHEDULED' | 'DELETED'>('SUCCEEDED');
	const limit = writable('10');
	const offset = writable('0');
	const filter = derived([state, limit, offset], ([state, limit, offset]) =>
		({ stateName: state, limit, offset })
	);
	const opts = writable(
		api.admin.jobs.createQuery.opts({
			initialData,
			refetchInterval: Infinity
		})
	);

	const jobs = api.admin.jobs.createQuery(filter, opts);
</script>

<Sheet.Root>
	<Sheet.Trigger class={cn(buttonVariants({variant: 'ghost'}))}>
		<ClipboardList class="size-6" />
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col gap-4">
		<Sheet.Header class="space-y-4">
			<Sheet.Title class="inline-flex items-center gap-2">
				<ClipboardList class="size-6" />
				Jobs
			</Sheet.Title>
			<Tabs.Root bind:value={$state}>
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
		{#if $jobs.isLoading}
			<LoaderCircle class="mx-auto size-5 animate-spin" />
		{/if}
		<div class="grow">
			{#each $jobs.data?.jobs ?? [] as job}
				<p>{job.name}</p>
			{/each}
		</div>
		<Pagination.Root onPageChange={
		(page) =>
		{
			$offset = String(page * Number($limit ?? 0));
		}
		} count={$jobs.data?.total ?? 0} perPage={$jobs.data?.limit??10}>
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