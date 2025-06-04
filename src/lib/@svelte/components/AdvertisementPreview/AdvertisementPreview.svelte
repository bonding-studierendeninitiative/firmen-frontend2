<script lang="ts">
	import { PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import type { AdvertisementOutput } from '@api/client';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';

	export let advertisement: AdvertisementOutput;
	let className = '';
	export { className as class };

	const download = trpc($page).catalogueData.generateDownloadLink.createQuery({
		documentId: advertisement.documentId,
		organizationId: "blabla"
	});
</script>

<section class={cn('flex flex-col gap-2 py-2', className)}>
	<PdfFilePreview url={`${$download.data}#toolbar=0&navpanes=0&scrollbar=0`} />
	<div class="@container w-full">
		<StatusBadge variant={advertisement.status} label={$_('status-text.' + advertisement.status)} />
	</div>
</section>
