<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import CreateBuyOptionForm from './create-buy-option-form.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { createBuyOptionForm } from '@/trpc/routers/admin';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	interface Props {
		isDialogOpen?: boolean;
		eventId: string;
		onCreateBuyOption?: ({
			submit,
			form,
			data
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	}

	let { isDialogOpen = $bindable(false), eventId, onCreateBuyOption }: Props = $props();
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.create-buy-option.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.create-buy-option.description')}</Dialog.Description>
		</Dialog.Header>
		{#if createBuyOptionForm({ eventId }).loading}
			<LoaderCircle class="animate-spin size-14 mx-auto" />
		{:else if createBuyOptionForm( { eventId } ).ready && createBuyOptionForm( { eventId } ).current?.createForm}
			<CreateBuyOptionForm
				bind:isDialogOpen
				createForm={createBuyOptionForm({ eventId }).current?.createForm!}
				{onCreateBuyOption}
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
