<script lang="ts">
	import { _ } from '@services';
	import LocalizedDate from '@/@svelte/components/LocalizedDate/LocalizedDate.svelte';
	import * as Item from '@/components/ui/item';
	import { toast } from 'svelte-sonner';
	import { Button } from '@/components/ui/button';
	import CreateDraftDialog from './create-draft-dialog.svelte';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { Skeleton } from '@/components/ui/skeleton';
	import { blur, crossfade, fade, slide } from 'svelte/transition';
	import { Root } from '@/@svelte/components';

	let {
		drafts,
		eventId,
		onDeleteDraft,
		onCreateDraft,
		loading = false,
		size = 10
	}: {
		drafts: {
			id?: string | undefined;
			subject?: string | undefined;
			lastModifiedDate?: string | undefined;
		}[];
		eventId: string;
		onDeleteDraft?: (draftId: string) => Promise<void>;
		onCreateDraft?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
		loading?: boolean;
		size?: number;
	} = $props();
</script>

<div class=" flex items-center justify-between flex-row py-4">
	<h2 class="text-lg font-medium text-stone-700">{$_('admin-pages.events.emails.draftInfo')}</h2>
	<CreateDraftDialog {onCreateDraft} {eventId} />
</div>
<Item.Group class=" mt-4 space-y-4">
	{#if loading}
		{#each Array(size) as _ignored}
			<Item.Root variant="outline">
				<Item.Content>
					<Skeleton class="h-5 bg-stone-200 rounded w-32 mb-1 animate-pulse" />
					<Skeleton class="h-4 bg-stone-200 rounded w-24 animate-pulse" />
				</Item.Content>
				<Item.Actions class=" space-x-3 inline-flex items-center">
					<Skeleton class="h-8 bg-stone-200 rounded w-22 animate-pulse" />
					<Button variant="destructive" disabled>
						{$_('common.delete')}
					</Button>
				</Item.Actions>
			</Item.Root>
		{/each}
	{:else}
		{#each drafts as draft (draft.id)}
			<Item.Root variant="outline">
				<Item.Content>
					<Item.Title>{draft.subject}</Item.Title>
					<Item.Description>
						<LocalizedDate date={draft.lastModifiedDate} />
					</Item.Description>
				</Item.Content>
				<Item.Actions class=" space-x-2">
					<a
						href={`/admin/events/${eventId}/emails/drafts/${draft.id}`}
						class=" btn btn-sm btn-primary">{$_('common.edit')}</a
					>
					<Button
						variant="destructive"
						onclick={() => {
							if (draft.id === undefined) {
								toast.error('Draft ID is undefined');
								return;
							}
							onDeleteDraft?.(draft.id);
						}}
					>
						{$_('common.delete')}
					</Button>
				</Item.Actions>
			</Item.Root>
		{:else}
			<p class="text-center text-stone-500">{$_('admin-pages.events.emails.noDrafts')}</p>
		{/each}
	{/if}
</Item.Group>
