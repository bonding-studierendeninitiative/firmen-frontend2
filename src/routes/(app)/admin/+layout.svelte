<script lang="ts">
	import { AdminJobs, Sidebar, SidebarItem } from '@/@svelte/modules';
	import { ADMIN_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';
	import { trpc } from '$lib/trpc/client';
	import { LoaderCircle } from '@lucide/svelte';
	import { writable } from 'svelte/store';

	let activeUrl = $derived(page.url.pathname);

	let { data, children } = $props();

	const api = trpc(page);
	const filter = writable<{
		limit: string,
		offset: string,
		stateName: 'SUCCEEDED' | 'FAILED' | 'PROCESSING' | 'ENQUEUED' | 'SCHEDULED' | 'DELETED'
	}>({
		limit: '10',
		offset: '0',
		stateName: 'SUCCEEDED'
	});
	const opts = writable(
		api.admin.jobs.createQuery.opts({
			initialData: data.jobs,
			refetchInterval: Infinity
		})
	);

	const jobs = api.admin.jobs.createQuery(filter, opts);
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		<div>
			{#each ADMIN_SIDEBAR_LINKS as { label, route, Icon } }
				<SidebarItem href={route} {label} icon={Icon} active={activeUrl.includes(route)} />
			{/each}
		</div>
	</Sidebar>

	<div class="h-dvh w-full grow overflow-y-scroll">
		{#if $jobs.isLoading}
			<LoaderCircle class="size-16 mx-auto animate-spin" />
		{:else if $jobs.data}
			<AdminJobs jobs={$jobs.data?.jobs ?? []} />
		{/if}
		<div class="w-full px-16 py-22 bg-white">
			{@render children?.()}
		</div>
	</div>


</div>
