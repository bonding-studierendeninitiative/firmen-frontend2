<script lang="ts">
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import type { LogoOutput } from '@api/client';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';

	export let logo: LogoOutput;
	let className = '';

	const thumbnail = trpc($page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: logo.documentId,
			resolution: 'small'
		},
		{
			enabled: logo.status !== 'missing'
		}
	);
	export { className as class };
</script>

<section class={cn('py-2 space-y-2', className)}>
	{#if Number($thumbnail.data?.length) > 0}
		<div
			class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
		>
			<img
				src={$thumbnail.data || '/placeholder.svg'}
				alt={logo.status}
				class="object-contain w-full h-full"
			/>
		</div>
	{/if}

	<div class="w-full @container">
		<StatusBadge variant={logo.status} label={$_('status-text.' + logo.status)} />
	</div>
</section>
