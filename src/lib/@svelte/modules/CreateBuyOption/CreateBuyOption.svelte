<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import CreateBuyOptionForm from './create-buy-option-form.svelte';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { Plus } from '@lucide/svelte';
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

	let { onCreateBuyOption, isDialogOpen = $bindable(false) }: Props = $props();
	let open = $state(false);
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }), 'border-dashed')}>
		<Plus class="size-4 mr-2" />
		{$_('common.create')}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.create-buy-option.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.create-buy-option.description')}</Dialog.Description>
		</Dialog.Header>
		<CreateBuyOptionForm bind:isDialogOpen={open} {onCreateBuyOption} />
	</Dialog.Content>
</Dialog.Root>
