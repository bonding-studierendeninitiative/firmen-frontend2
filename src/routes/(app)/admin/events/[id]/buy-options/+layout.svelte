<script lang="ts">
	import { page } from '$app/state';
	import { goto, invalidate } from '$app/navigation';
	import { DeleteBuyOption, BuyOptionSelector, CreateBuyOption } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { SimpleBuyOptionResponse } from '@api/admin-client';
	import { toast } from 'svelte-sonner';
	import {
		activateBuyOption,
		createBuyOption,
		createBuyOptionForm,
		deleteBuyOption,
		getBuyOptions
	} from '@/remote/functions/admin';

	let { children } = $props();

	function mapBuyOptionToValue(buyOption: SimpleBuyOptionResponse) {
		return {
			value: buyOption.id ?? '',
			name: buyOption.name ?? '',
			label: buyOption.name ?? $_('modules.buy-option-selector.unnamed'),
			active: !!buyOption.active
		};
	}

	let isDialogOpen = writable(false);
	setContext('isCreateBuyOptionDialogOpen', isDialogOpen);

	let buyOptionsFilter = $derived.by(() => ({
		eventId: page.params.id!,
		page: 0,
		limit: 10,
		sortBy: 'creationDate',
		sortDirection: 'desc'
	}));
</script>

{#if getBuyOptions(buyOptionsFilter).loading}
	<LoaderCircle class="animate-spin size-14 mx-auto" />
{:else if getBuyOptions(buyOptionsFilter).ready}
	{@const buyOptions = getBuyOptions(buyOptionsFilter).current?.buyOptions ?? []}
	{@const activeBuyOption = buyOptions.find((buyOption) => buyOption.active)}

	<section in:fade class="mt-10 flex flex-col gap-y-8">
		<nav class="flex justify-between gap-x-2">
			<BuyOptionSelector
				buyOptions={buyOptions.map(mapBuyOptionToValue) ?? []}
				value={page.params.buyOptionId}
				onSelect={async (value) => {
					await goto(`/admin/events/${page.params.id}/buy-options/${value}`);
					await invalidate('buyOption');
				}}
			/>
			<DeleteBuyOption
				onDelete={async () => {
					try {
						await deleteBuyOption({
							buyOptionId: page.params.buyOptionId!,
							eventId: page.params.id!
						}).updates(
							getBuyOptions(buyOptionsFilter).withOverride((data) => {
								return {
									...data,
									buyOptions: data.buyOptions?.filter(
										(option) => option.id !== page.params.buyOptionId
									)
								};
							})
						);
						goto(`/admin/events/${page.params.id}/buy-options`);
						toast.success($_('modules.delete-buy-option.success'));
					} catch (e) {
						toast.error(e?.body?.message || $_('modules.delete-buy-option.error'));
						throw e;
					}
				}}
			/>
			<div class="grow"></div>
			<Button
				onclick={async () => {
					try {
						console.log('Activating buy option', page.params.buyOptionId);

						await activateBuyOption({
							buyOptionId: page.params.buyOptionId!,
							eventId: page.params.id!
						}).updates(
							getBuyOptions(buyOptionsFilter).withOverride((data) => {
								return {
									...data,
									buyOptions: data.buyOptions?.map((option) => ({
										...option,
										active: option.id === page.params.buyOptionId
									}))
								};
							})
						);
						toast.success($_('modules.activate-buy-option.success'));
					} catch (e) {
						toast.error(e?.body?.message || $_('modules.activate-buy-option.error'));
					}
				}}
				disabled={!page.params.buyOptionId || page.params.buyOptionId === activeBuyOption?.id}
				>{$_('admin-pages.events.buy-options.publish')}</Button
			>
		</nav>
		{@render children?.()}
	</section>
{/if}

<CreateBuyOption
	bind:isDialogOpen={$isDialogOpen}
	eventId={page.params.id!}
	onCreateBuyOption={async ({ submit, form }) => {
		// Handle the creation of a new buy option
		await submit().updates(
			getBuyOptions(buyOptionsFilter).withOverride((prev) => {
				// Invalidate the buy options list to include the newly created buy option
				return {
					...prev,
					buyOptions: prev.buyOptions ? [createBuyOption.result?.data!, ...prev.buyOptions] : []
				};
			})
		);
		const result = createBuyOption.result;
		if (result?.success !== undefined && result.success && result?.data !== undefined) {
			toast.success($_('modules.create-buy-option.success'));
			await goto(`/admin/events/${page.params.id!}/buy-options/${result.data.id}`);
			form.reset();
			await createBuyOptionForm({ eventId: page.params.id! }).refresh();
		} else {
			toast.error($_('modules.create-buy-option.error'));
			throw new Error('Could not create buy option');
		}
	}}
/>
