<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import CreateBuyOptionForm from './create-buy-option-form.svelte';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	interface Props {
		isDialogOpen?: boolean;
		onCreateBuyOption?: ({
			submit
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
		}) => Promise<void>;
	}

	let { isDialogOpen = $bindable(false), onCreateBuyOption }: Props = $props();
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.create-buy-option.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.create-buy-option.description')}</Dialog.Description>
		</Dialog.Header>
		<CreateBuyOptionForm bind:isDialogOpen {onCreateBuyOption} />
	</Dialog.Content>
</Dialog.Root>
