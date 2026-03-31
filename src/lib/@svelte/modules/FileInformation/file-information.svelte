<script lang="ts">
	import { _ } from '@services';
	import type { DocumentVersionOutput_Detailed } from '@api/client';
	import { LocalizedDate } from '@/@svelte/components';
	import { getHumanReadableFileSize } from '@/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		documentVersion: Omit<DocumentVersionOutput_Detailed, 'document'>;
	}

	let { documentVersion, ...rest }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest}>
	<h4 class="font-semibold mb-2">
		{$_('modules.admin-view-logo-dialog.file-information')}
	</h4>
	<div class="space-y-2">
		<div class="flex justify-between">
			<span class="text-gray-600 dark:text-gray-400"
				>{$_('modules.admin-view-logo-dialog.file-type')}</span
			>
			<span>{$_('file-types.' + (documentVersion?.contentType ?? 'unknown'))}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-gray-600 dark:text-gray-400"
				>{$_('modules.admin-view-logo-dialog.file-size')}</span
			>
			<span>{getHumanReadableFileSize(documentVersion?.size ?? 0)}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-gray-600 dark:text-gray-400"
				>{$_('modules.admin-view-logo-dialog.file-created')}</span
			>
			<LocalizedDate date={documentVersion?.createdAt} />
		</div>
		<div class="flex justify-between">
			<span class="text-gray-600 dark:text-gray-400"
				>{$_('modules.admin-view-logo-dialog.file-modified')}</span
			>
			<LocalizedDate date={documentVersion?.modifiedAt} />
		</div>
	</div>
</div>
