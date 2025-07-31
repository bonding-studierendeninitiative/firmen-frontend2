<script lang="ts">
	import { page } from '$app/state';
	import { LocalizedDate } from '@/@svelte/components';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Skeleton } from '@/components/ui/skeleton';
	import { trpc } from '@/trpc/client';
	import { getHumanReadableFileSize } from '@/utils';
	import type { ExportForEventOutput } from '@api/admin-client';
	import { Download, FileText, ImageIcon, Palette } from '@lucide/svelte';
	import { _ } from '@services';
	import DeleteExportDialog from './delete-export-dialog.svelte';

	interface Props {
		exports: ExportForEventOutput[];
		eventId: string;
	}

	let { exports, eventId }: Props = $props();

	const download = trpc(page).admin.export.generateDownloadLink.createMutation();

	function handleDownload(exportItem: ExportForEventOutput) {
		$download.mutate(
			{
				eventId,
				exportId: exportItem.id
			},
			{
				onSuccess: (result) => {
					const url = result;
					if (url) {
						const a = document.createElement('a');
						a.href = url;
						a.download = url.split('/').pop();
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
				}
			}
		);
	}

	const getDocumentTypeColor = (type: ExportForEventOutput['type']) => {
		switch (type) {
			case 'logo':
				return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
			case 'advert':
				return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
			case 'portrait':
				return 'bg-green-100 text-green-800 hover:bg-green-200';
			default:
				return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
		}
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#each exports as exportItem (exportItem.id)}
		<Card.Root class="hover:shadow-md transition-shadow">
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if exportItem.type === 'advert'}
							<Palette class="size-4" />
						{:else if exportItem.type === 'logo'}
							<ImageIcon class="size-4" />
						{:else}
							<FileText class="size-4" />
						{/if}
						<Badge variant="secondary" class={getDocumentTypeColor(exportItem.type)}>
							{$_('common.' + exportItem.type)}
						</Badge>
					</div>
					<Badge variant="outline" class="uppercase">
						{#if exportItem.type === 'portrait'}
							csv
						{:else}
							zip
						{/if}
					</Badge>
				</div>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#if exportItem.status === 'pending'}
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-muted-foreground">
								{$_('admin-pages.events.exports.headers.entries')}
							</p>
							<Skeleton class="h-7 w-full" />
						</div>
						<div>
							<p class="text-muted-foreground">
								{$_('admin-pages.events.exports.headers.file-size')}
							</p>
							<Skeleton class="h-7 w-full" />
						</div>
						<div>
							<p class="text-muted-foreground text-sm">
								{$_('admin-pages.events.exports.headers.created')}
							</p>
							<p class="font-medium text-sm"><LocalizedDate date={exportItem.createdAt} /></p>
						</div>
						<div>
							<p class="text-muted-foreground text-sm">
								{$_('admin-pages.events.exports.headers.status')}
							</p>
							<p class="font-medium text-sm">{$_('admin-pages.events.exports.status.pending')}</p>
						</div>
					</div>
					<div class="flex gap-2 pt-2">
						<Button variant="outline" size="sm" disabled class="flex-1 bg-transparent">
							<Download class="h-4 w-4 mr-2" />
							{$_('common.download')}
						</Button>
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-muted-foreground">
								{$_('admin-pages.events.exports.headers.entries')}
							</p>
							<p class="font-medium">{exportItem.files?.toLocaleString()}</p>
						</div>
						<div>
							<p class="text-muted-foreground">
								{$_('admin-pages.events.exports.headers.file-size')}
							</p>
							<p class="font-medium">{getHumanReadableFileSize(exportItem.size ?? 0)}</p>
						</div>
						<div>
							<p class="text-muted-foreground text-sm">
								{$_('admin-pages.events.exports.headers.created')}
							</p>
							<p class="font-medium text-sm"><LocalizedDate date={exportItem.createdAt} /></p>
						</div>
						<div>
							<p class="text-muted-foreground text-sm">
								{$_('admin-pages.events.exports.headers.status')}
							</p>
							<p class="font-medium text-sm">
								{$_('admin-pages.events.exports.status.' + exportItem.status)}
							</p>
						</div>
					</div>
					<div class="flex gap-2 pt-2">
						<Button
							variant="outline"
							size="sm"
							class="flex-1 bg-transparent"
							onclick={() => handleDownload(exportItem)}
						>
							<Download class="h-4 w-4 mr-2" />
							{$_('common.download')}
						</Button>
                        <DeleteExportDialog {eventId} exportId={exportItem.id} />
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	{/each}
</div>
