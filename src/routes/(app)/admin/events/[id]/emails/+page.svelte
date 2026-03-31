<script lang="ts">
	import { _ } from 'svelte-i18n';
	import {
		deleteEmailDraft,
		getEmailDrafts,
		createEmailDraft
	} from '@/remote/functions/admin/event-emails.remote.js';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import EmailDraftList from './email-draft-list.svelte';
	import * as Pagination from '@/components/ui/pagination';
	import { toast } from 'svelte-sonner';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import * as Select from '@/components/ui/select';
	import { fade } from 'svelte/transition';

	let { params: routeParams } = $props();

	let params = queryParameters(
		{
			limit: ssp.number(5),
			offset: ssp.number(0)
		},
		{
			showDefaults: false
		}
	);

	let draftsFilter = $derived({
		eventId: routeParams.id,
		page: params.offset,
		size: params.limit
	});

	let emailDraftsQuery = $derived(getEmailDrafts(draftsFilter));
</script>

<div in:fade>
	<EmailDraftList
		size={params.limit}
		drafts={emailDraftsQuery.current?.drafts ?? []}
		loading={emailDraftsQuery.loading}
		eventId={routeParams.id}
		onDeleteDraft={async (draftId) => {
			// Optionally, you can add a notification or refresh logic here
			await deleteEmailDraft({ eventId: routeParams.id, draftId }).updates(
				emailDraftsQuery.withOverride((prev) => ({
					...prev,
					drafts: prev.drafts?.filter((draft) => draft.id !== draftId)
				}))
			);

			toast.success('Draft deleted successfully');
		}}
		onCreateDraft={async ({ submit }) => {
			// Optionally, you can add a notification or refresh logic here
			await submit().updates(emailDraftsQuery);
			const result = createEmailDraft.result;
			if (result !== undefined) {
				console.log('Draft created:', result);
				toast.success('Draft created successfully');
			}
		}}
	/>
	<div class="flex justify-center items-center gap-x-8 my-4">
		<Select.Root
			type="single"
			bind:value={
				() => {
					if (params.limit === undefined || params.limit === null) return '10';
					return params.limit.toString();
				},
				(value) => {
					params.limit = Number(value);
				}
			}
		>
			<Select.Trigger class="w-auto">
				{params.limit.toString()}
			</Select.Trigger>
			<Select.Content>
				{#each [5, 10, 25, 50] as size}
					<Select.Item label={String(size)} value={size.toString()}>
						{size}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Pagination.Root
			class="w-fit mx-0"
			count={emailDraftsQuery.current?.totalElements ?? 0}
			perPage={params.limit}
			bind:page={() => params.offset + 1, (value) => (params.offset = value - 1)}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="size-4" />{$_('common.previous')}
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link
									{page}
									isActive={currentPage === page.value}
									class={currentPage === page.value ? 'border-1 border-stone-950' : ''}
								>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton
							>{$_('common.next')} <ChevronRight class="size-4" /></Pagination.NextButton
						>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</div>
</div>
