<script lang="ts">
	import { page } from '$app/state';
	import { LocalizedDate } from '@/@svelte/components';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import * as Table from '@/components/ui/table';
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

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{$_('admin-pages.events.exports.headers.document-type')}</Table.Head>
				<Table.Head>{$_('admin-pages.events.exports.headers.status')}</Table.Head>
				<Table.Head>{$_('admin-pages.events.exports.headers.entries')}</Table.Head>
				<Table.Head>{$_('admin-pages.events.exports.headers.file-size')}</Table.Head>
				<Table.Head>{$_('admin-pages.events.exports.headers.content-type')}</Table.Head>
				<Table.Head>{$_('admin-pages.events.exports.headers.created')}</Table.Head>
				<Table.Head class="text-right">{$_('admin-pages.events.exports.headers.actions')}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each exports as exportItem (exportItem.id)}
				<Table.Row>
					<Table.Cell>
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
					</Table.Cell>
                    <Table.Cell>{$_("admin-pages.events.exports.status." + exportItem.status)}</Table.Cell>
					<Table.Cell>
						{#if exportItem.status === 'pending'}
							<Skeleton class="h-7 w-full" />
						{:else}
							{exportItem.files?.toLocaleString()}
						{/if}
					</Table.Cell>
					<Table.Cell>
						{#if exportItem.status === 'pending'}
							<Skeleton class="h-7 w-full" />
						{:else}
							{getHumanReadableFileSize(exportItem.size ?? 0)}
						{/if}
					</Table.Cell>
					<Table.Cell>
						<Badge variant="outline" class="uppercase">
							{#if exportItem.type === 'portrait'}
								csv
							{:else}
								zip
							{/if}
						</Badge>
					</Table.Cell>
					<Table.Cell><LocalizedDate date={exportItem.createdAt} /></Table.Cell>
					<Table.Cell class="text-right">
						<div class="flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" onclick={() => handleDownload(exportItem)}>
								<Download class="h-4 w-4" />
							</Button>
                            <DeleteExportDialog {eventId} exportId={exportItem.id} />
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
