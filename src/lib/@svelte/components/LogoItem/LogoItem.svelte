<script lang="ts">
	import * as Card from '@/components/ui/card';
	import type { InferOutput } from 'valibot';
	import { PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import type { LogoSchema } from '@schema';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { ViewLogoDialog } from '@/@svelte/modules';


	export let logo: InferOutput<LogoSchema>;
	let className = '';
	export { className as class };

	let showDialog = false;
</script>

<section>
	<Card.Root
		class={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", className)}>
		<Card.Header class="p-4">
			<div
				class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative">
				<div
					class="absolute inset-0 flex items-center transition-opacity duration-300 justify-center opacity-0 hover:opacity-100 bg-gray-900/60">
					<Button variant="outline" on:click={() => showDialog = true}>{$_("common.view-details")}</Button>
				</div>
				{#if logo.mimeType.startsWith("image/")}
					<img src={logo.url || "/placeholder.svg"} alt={logo.title} class="object-contain w-full h-full" />
				{:else}
					<PdfFilePreview url={`${logo.url}#toolbar=0&navpanes=0&scrollbar=0`} />
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="p-4 pt-0">
			<div class="flex justify-between items-center gap-2 @container">
				<h3 title={logo.title} class="font-semibold text-lg truncate">{logo.title}</h3>
				<StatusBadge variant={logo.status} label={$_("status-text."+logo.status)} />
			</div>
		</Card.Content>
	</Card.Root>
</section>
<ViewLogoDialog bind:open={showDialog} {logo} />