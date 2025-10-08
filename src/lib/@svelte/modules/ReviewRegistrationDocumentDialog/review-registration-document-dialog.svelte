<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { cn } from '@/utils';
	import ReviewRegistrationDocumentForm from './review-registration-document-form.svelte';
	import type { AdminRegistrationDocumentOutput } from '@api/admin-client';

	let open: boolean = $state(false);

	interface Props {
		document: AdminRegistrationDocumentOutput;
	}

	let { document }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>Review&hellip;</Dialog.Trigger>
	<Dialog.Content class="max-w-(--breakpoint-lg)">
		<ReviewRegistrationDocumentForm bind:open {document} />
	</Dialog.Content>
</Dialog.Root>
