<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { cn } from '@/utils';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import ReviewRegistrationDocumentForm from './review-registration-document-form.svelte';
	import type { AdminRegistrationDocumentOutput } from '@api/admin-client';

	let open: boolean = $state(false);

	interface Props {
		document: AdminRegistrationDocumentOutput;
	}

	let { document }: Props = $props();

	const api = trpc(page);
	const reviewFormQuery = api.admin.documents.reviewForm.createQuery();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({variant:"outline"}))}>
		Review&hellip;
	</Dialog.Trigger>
	<Dialog.Content class="max-w-(--breakpoint-lg)">
		{#if $reviewFormQuery.data}
			<ReviewRegistrationDocumentForm bind:open {document} catalogueDataReviewForm={$reviewFormQuery.data} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
