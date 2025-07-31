<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import CreateBuyOptionForm from './create-buy-option-form.svelte';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		isDialogOpen?: boolean;
	}

	let { isDialogOpen = $bindable(false) }: Props = $props();

	let api = trpc(page);

	let createFormQuery = api.admin.events.buyOptions.createForm.createQuery();
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Overlay />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.create-buy-option.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.create-buy-option.description')}</Dialog.Description>
		</Dialog.Header>
		{#if $createFormQuery.isLoading}
			<LoaderCircle class="animate-spin size-14 mx-auto" />
		{:else if $createFormQuery.isError}
			<p class="text-red-500 text-center">
				{$_('modules.create-buy-option.error', {
					values: { error: $createFormQuery.error.message }
				})}
			</p>
		{:else if $createFormQuery.isSuccess && $createFormQuery.data?.createForm}
			<CreateBuyOptionForm bind:isDialogOpen createForm={$createFormQuery.data?.createForm} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
