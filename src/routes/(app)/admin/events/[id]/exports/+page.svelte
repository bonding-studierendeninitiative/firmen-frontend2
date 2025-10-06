<script lang="ts">
	import ExportsTableView from './exports-table-view.svelte';
	import { Button } from '@/components/ui/button';
	import {
		ChevronLeft,
		ChevronRight,
		FileText,
		Grid3X3,
		LoaderCircle,
		RefreshCw,
		TableIcon
	} from '@lucide/svelte';
	import ExportsGridView from './exports-grid-view.svelte';
	import * as Pagination from '@/components/ui/pagination';
	import { _ } from '@services';
	import { page } from '$app/state';
	import { cn } from '@/utils';
	import { toast } from 'svelte-sonner';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import { deleteExport, generateDownloadLink, getAllExports } from '@/remote/functions/admin';
	import type { ExportForEventOutput } from '@api/admin-client';

	const params = queryParameters(
		{
			page: ssp.number(0),
			limit: ssp.number(10)
		},
		{
			showDefaults: false
		}
	);

	let exportFilters = $derived.by(() => ({
		eventId: page.params.id!,
		page: params.page,
		limit: params.limit
	}));

	async function onDelete({ eventId, exportId }: { eventId: string; exportId: string }) {
		try {
			await deleteExport({ eventId, exportId }).updates(
				getAllExports(exportFilters).withOverride((old) => ({
					...old,
					exports: old.exports?.filter((exp) => exp.id !== exportId) ?? [],
					totalElements: Number(old.totalElements) - 1
				}))
			);
			toast.success('Der Export wurde gelöscht');
		} catch (error) {
			toast.error('Beim Löschen des Exports ist ein Fehler aufgetreten');
		}
	}

	async function onDownload({ eventId, exportId }: { eventId: string; exportId: string }) {
		const url = await generateDownloadLink({
			eventId,
			exportId
		});
		if (url) {
			const a = document.createElement('a');
			a.href = url;
			a.download = url.split('/').pop();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}

	let viewMode = $state<'table' | 'grid'>('table');
</script>

{#if getAllExports(exportFilters).loading}
	<LoaderCircle class="size-10 mx-auto animate-spin my-10" />
{:else if getAllExports(exportFilters).current}
	<div class="container mx-auto py-6 space-y-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1">
				<span class=" text-sm text-muted-foreground"
					>{$_('admin-pages.events.exports.summary', {
						values: { exports: getAllExports(exportFilters).current?.totalElements }
					})}</span
				>
				<Button
					title="Aktualisieren"
					size="sm"
					variant="ghost"
					onclick={async () => {
						getAllExports(exportFilters).refresh();
						toast.success('Die Exporte wurden aktualisiert');
					}}
					disabled={getAllExports(exportFilters).loading}
				>
					<RefreshCw
						class={cn('size-3', { 'animate-spin': getAllExports(exportFilters).loading })}
					/>
				</Button>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant={viewMode === 'table' ? 'default' : 'outline'}
					size="sm"
					onclick={() => (viewMode = 'table')}
				>
					<TableIcon class="h-4 w-4 mr-2" />
					{$_('admin-pages.events.exports.table')}
				</Button>
				<Button
					variant={viewMode === 'grid' ? 'default' : 'outline'}
					size="sm"
					onclick={() => (viewMode = 'grid')}
				>
					<Grid3X3 class="h-4 w-4 mr-2" />
					{$_('admin-pages.events.exports.grid')}
				</Button>
			</div>
		</div>
		{#if getAllExports(exportFilters).current?.totalElements === 0}
			<div class="text-center py-12">
				<FileText class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 class="text-lg font-medium mb-2">
					{$_('admin-pages.events.exports.no-exports-found.title')}
				</h3>
				<p class="text-muted-foreground">
					{$_('admin-pages.events.exports.no-exports-found.description')}
				</p>
			</div>
		{:else}
			{#if viewMode === 'table'}
				<ExportsTableView
					eventId={page.params.id!}
					exports={getAllExports(exportFilters).current?.exports ?? []}
					{onDelete}
					{onDownload}
				/>
			{:else}
				<ExportsGridView
					eventId={page.params.id!}
					exports={getAllExports(exportFilters).current?.exports ?? []}
					{onDelete}
					{onDownload}
				/>
			{/if}

			<Pagination.Root
				class="mt-6"
				onPageChange={async (pageNumber) => {
					params.page = pageNumber - 1;
				}}
				page={Number(params.page) + 1}
				count={Number(getAllExports(exportFilters).current?.totalElements)}
				perPage={Number(params.limit)}
			>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeft class="size-4" />
								<span class="hidden sm:block">{$_('common.previous')}</span>
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<span class="hidden sm:block">{$_('common.next')}</span>
								<ChevronRight class="size-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		{/if}
	</div>
{/if}
