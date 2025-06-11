<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import {
		type AdvertisementSchema
	} from '@schema';
	import type { InferOutput } from 'valibot';
	import { cn } from '@/utils';
	import ReviewAdvertisementForm from '@/@svelte/modules/ReviewAdvertisementDialog/ReviewAdvertisementForm.svelte';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';

	let open: boolean;

	export let advertisement: InferOutput<AdvertisementSchema>;
	const api = trpc(page)
	const reviewFormQuery = api.admin.documents.reviewForm.createQuery()
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant:"outline"}))} disabled={$reviewFormQuery.isLoading}>
		Review&hellip;
	</Dialog.Trigger>
	<Dialog.Content class="max-w-screen-lg">
		{#if $reviewFormQuery.data}
		<ReviewAdvertisementForm bind:open {advertisement} catalogueDataReviewForm={$reviewFormQuery.data} />
			{/if}
	</Dialog.Content>
</Dialog.Root>
