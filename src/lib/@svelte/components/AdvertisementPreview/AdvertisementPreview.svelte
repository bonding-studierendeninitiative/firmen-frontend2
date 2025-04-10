<script lang="ts">
	import type { InferOutput } from 'valibot';
	import type { AdvertisementSchema } from '@schema/advertisements';
	import { LocalizedDate, PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';


	export let advertisement: InferOutput<AdvertisementSchema>;
	let className = '';
	export { className as class };
</script>

<section class={cn("flex flex-col gap-2 py-2",className)}>
			<PdfFilePreview url={`${advertisement.url}#toolbar=0&navpanes=0&scrollbar=0`} />
	<div class="@container w-full">

			<StatusBadge variant={advertisement.status} label={$_("status-text."+advertisement.status)} />
	</div>
			<LocalizedDate date={advertisement.modifiedAt ?? advertisement.createdAt} />
</section>