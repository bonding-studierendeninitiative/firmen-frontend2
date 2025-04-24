<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import {
		type LogoSchema
	} from '@schema';
	import type { InferOutput } from 'valibot';
	import { cn } from '@/utils';
	import { trpc } from '@/trpc/client';
	import ReviewLogoForm from '@/@svelte/modules/ReviewLogoDialog/ReviewLogoForm.svelte';
	import { page } from '$app/stores';

	let open: boolean;

	export let logo: InferOutput<LogoSchema>;

	const api = trpc($page);
	const reviewFormQuery = api.admin.catalogueData.logos.reviewForm.createQuery();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant:"outline"}))}>
		Review&hellip;
	</Dialog.Trigger>
	<Dialog.Content class="max-w-screen-lg">
		{#if $reviewFormQuery.data}
			<ReviewLogoForm bind:open {logo} catalogueDataReviewForm={$reviewFormQuery.data} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
