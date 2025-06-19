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
	import { page } from '$app/state';

	let open: boolean = $state(false);

	interface Props {
		logo: InferOutput<LogoSchema>;
	}

	let { logo }: Props = $props();

	const api = trpc(page);
	const reviewFormQuery = api.admin.documents.reviewForm.createQuery();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant:"outline"}))}>
		Review&hellip;
	</Dialog.Trigger>
	<Dialog.Content class="max-w-(--breakpoint-lg)">
		{#if $reviewFormQuery.data}
			<ReviewLogoForm bind:open {logo} catalogueDataReviewForm={$reviewFormQuery.data} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
