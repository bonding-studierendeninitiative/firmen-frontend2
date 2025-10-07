<script lang="ts">
	import { _ } from '@services';
	import { PencilSquareIcon } from '$lib/@svelte/icons';
	import type { BillingAddressTemplate } from '@schema';
	import { type Infer } from 'sveltekit-superforms';
	import { Trash } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import {
		deleteBillingAddressTemplate,
		makeBillingAddressTemplateDefault
	} from '@/remote/functions';

	let isDeleteFormOpen = $state(false);
	interface Props {
		isDefault: boolean;
		billingAddress: Infer<BillingAddressTemplate>;
	}

	let { isDefault, billingAddress }: Props = $props();
</script>

<div class=" bg-stone-50 p-4 w-full flex justify-between mt-2 rounded-lg">
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		<div class=" text-stone-800 text-sm font-normal">
			<p class=" m-0">{billingAddress.organizationName}</p>
			<p class=" m-0">{billingAddress.street}</p>
			<p class=" m-0">{billingAddress.zipCode}, {billingAddress.city}</p>
			<p class=" m-0">{billingAddress.country}</p>
		</div>
		<span class=" flex items-center justify-end">
			<!-- <GradientButton classes="px-6" onClick={() => undefined}>Details</GradientButton> -->
			{#if isDefault}
				<div class=" bg-stone-200 mx-6 text-slate-700 rounded-lg py-1.5 px-4">
					{$_('user-pages.settings.default')}
				</div>
			{:else}
				<Button
					class="mx-6"
					onclick={() =>
						makeBillingAddressTemplateDefault({ billingAddressTemplateId: billingAddress.id })}
					>{$_('user-pages.settings.makeItDefault')}</Button
				>
			{/if}
			<button class="text-stone-500"><PencilSquareIcon /></button>
			<Dialog.Root bind:open={isDeleteFormOpen}>
				<Dialog.Trigger>
					<button class="text-stone-500"><Trash /></button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>{$_('user-pages.settings.deleteAddress')}</Dialog.Title>
					<Dialog.Description>
						{$_('user-pages.settings.deleteAddressDescription')}
					</Dialog.Description>
					<Dialog.Footer>
						<Dialog.Close>
							{$_('common.cancel')}
						</Dialog.Close>
						<Button
							variant="destructive"
							onclick={() =>
								deleteBillingAddressTemplate({ billingAddressTemplateId: billingAddress.id })}
							>{$_('common.delete')}</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</span>
	</div>
</div>
