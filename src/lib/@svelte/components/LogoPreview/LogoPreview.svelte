<script lang="ts">
	import type { InferOutput } from 'valibot';
	import { PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import type { LogoSchema } from '@schema';
	import { _ } from '@services';
	import { cn } from '@/utils';

	export let logo: InferOutput<LogoSchema>;
	let className = '';
	export { className as class };
</script>

<section class={cn("py-2 space-y-2", className)}>
	<div
		class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
		{#if logo.mimeType.startsWith("image/")}
			<img src={logo.url || "/placeholder.svg"} alt={logo.title} class="object-contain w-full h-full" />
		{:else}
			<PdfFilePreview url={`${logo.url}#toolbar=0&navpanes=0&scrollbar=0`} />
		{/if}
	</div>
	<h3 title={logo.title} class="font-semibold text-lg truncate">{logo.title}</h3>
	<div class="@container">
		<StatusBadge variant={logo.status} label={$_("status-text."+logo.status)} />
	</div>
</section>