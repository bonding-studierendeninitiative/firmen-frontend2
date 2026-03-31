<script lang="ts">
	import { _ } from '@services';
	import * as Tabs from '@/components/ui/tabs';
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import { getBuyOption } from '@/remote/functions/admin';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';

	let { params, children } = $props();

	const tabs = [
		{ value: 'editor', label: $_('components.editBuyOptions.editor') },
		{ value: 'event-days', label: $_('components.editBuyOptions.event-days') },
		{ value: 'addon-packages', label: $_('components.editBuyOptions.addon-packages') },
		{ value: 'preview', label: $_('components.editBuyOptions.preview') },
		{ value: 'settings', label: $_('components.editBuyOptions.settings') }
	];

	let activeTab = $derived(
		tabs.find((tab) =>
			page.url.pathname.includes(
				`/admin/events/${params.id}/buy-options/${params.buyOptionId}/${tab.value}`
			)
		)?.value || 'editor'
	);

	// Create a single shared query instance for this buy option
	// This will be shared across all child tabs (editor, event-days, etc.)
	let sharedBuyOptionQuery = getBuyOption({
		eventId: params.id,
		buyOptionId: params.buyOptionId
	});

	// Share the query with all child components via context
	setContext<RemoteQuery<GetEventBuyOptionOutput>>('sharedBuyOptionQuery', sharedBuyOptionQuery);
</script>

<Tabs.Root bind:value={activeTab} class="space-y-4">
	<Tabs.List>
		{#each tabs as tab (tab.value)}
			<a href={`/admin/events/${params.id}/buy-options/${params.buyOptionId}/${tab.value}`}>
				<Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
			</a>
		{/each}
	</Tabs.List>
</Tabs.Root>

{@render children?.()}
