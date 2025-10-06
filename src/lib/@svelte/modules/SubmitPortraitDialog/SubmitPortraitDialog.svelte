<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import SubmitPortraitForm from './SubmitPortraitForm.svelte';
	import { submitPortraitForm } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	let {
		open = $bindable(false),
		id,
		orgId,
		onSubmitPortrait
	}: {
		open: boolean;
		id: string;
		orgId: string;
		onSubmitPortrait?: (args: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[80dvw] max-h-[80dvh] @container/pick-portrait flex flex-col">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.submit-portrait-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.submit-portrait-dialog.description')}</Dialog.Description>
		</Dialog.Header>

		{#if submitPortraitForm({ eventRegistrationId: id }).ready}
			<SubmitPortraitForm
				{id}
				{orgId}
				submitPortraitForm={submitPortraitForm({ eventRegistrationId: id }).current!}
				{onSubmitPortrait}
			/>
		{/if}

		<Dialog.Footer>
			<!--<Button disabled={!selectedPortrait || $pickPortrait.isPending} onclick={() => {
				$pickPortrait.mutate({ portraitId: selectedPortrait, eventRegistrationId: id, organizationId: orgId })
			}}>{$_("common.select")}</Button>-->
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
