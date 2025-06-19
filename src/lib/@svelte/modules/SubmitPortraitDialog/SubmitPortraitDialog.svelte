<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import SubmitPortraitForm from './SubmitPortraitForm.svelte';

	let { open = $bindable(false), id, orgId }: { open: boolean; id: string; orgId: string } = $props();

	const api = trpc(page);

	let submitFormQuery = api.eventRegistrations.submitPortraitForm.createQuery({
		eventRegistrationId: id
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pick-portrait">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.submit-portrait-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.submit-portrait-dialog.description')}</Dialog.Description>
		</Dialog.Header>

		{#if $submitFormQuery.data}
			<SubmitPortraitForm {id} {orgId} submitPortraitForm={$submitFormQuery.data} />
		{/if}

		<Dialog.Footer>
			<!--<Button disabled={!selectedPortrait || $pickPortrait.isPending} onclick={() => {
				$pickPortrait.mutate({ portraitId: selectedPortrait, eventRegistrationId: id, organizationId: orgId })
			}}>{$_("common.select")}</Button>-->
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
