<script lang="ts">
	import { _ } from '@services';
	import * as Item from '@/components/ui/item';
	import { PencilSquareIcon } from '$lib/@svelte/icons';
	import type { BillingAddressTemplate } from '@schema';
	import { type Infer } from 'sveltekit-superforms';
	import { PenBox, Trash2 } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/alert-dialog';
	import { cn } from '@/utils';
	import CopyButton from '@/components/auth/CopyButton.svelte';
	import { Badge } from '@/components/ui/badge';

	let isDeleteFormOpen = $state(false);
	interface Props {
		isDefault: boolean;
		billingAddress: Infer<BillingAddressTemplate>;
		makeBillingAddressTemplateDefault?: (args: {
			billingAddressTemplateId: string;
		}) => Promise<void>;
		deleteBillingAddressTemplate?: (args: { billingAddressTemplateId: string }) => Promise<void>;
	}

	let {
		isDefault,
		billingAddress,
		makeBillingAddressTemplateDefault,
		deleteBillingAddressTemplate
	}: Props = $props();
</script>

<Item.Root variant={isDefault ? 'muted' : 'outline'} class="p-4">
	<Item.Content class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		<div class=" text-stone-800 text-sm font-normal">
			<Item.Title class=" m-0">{billingAddress.organizationName}</Item.Title>
			<p class=" m-0">{billingAddress.street}</p>
			<p class=" m-0">{billingAddress.zipCode}, {billingAddress.city}</p>
			<p class=" m-0">{billingAddress.country}</p>
		</div>
	</Item.Content>
	<Item.Actions class="space-x-2">
		<!-- <GradientButton classes="px-6" onClick={() => undefined}>Details</GradientButton> -->
		{#if isDefault}
			<Badge variant="outline">
				{$_('user-pages.settings.default')}
			</Badge>
		{:else}
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					makeBillingAddressTemplateDefault?.({
						billingAddressTemplateId: billingAddress.id
					})}>{$_('user-pages.settings.makeItDefault')}</Button
			>
		{/if}
		<button class="text-stone-500"><PenBox class="size-4" /></button>
		<Dialog.Root bind:open={isDeleteFormOpen}>
			<Dialog.Trigger
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'icon' }),
					'hover:text-destructive-foreground hover:bg-destructive'
				)}
				type="button"
			>
				<Trash2 />
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>{$_('user-pages.settings.deleteAddress')}</Dialog.Title>
				<Dialog.Description>
					{$_('user-pages.settings.deleteAddressDescription')}
				</Dialog.Description>
				<Dialog.Footer>
					<Dialog.Cancel>
						{$_('common.cancel')}
					</Dialog.Cancel>
					<Button
						variant="destructive"
						onclick={() =>
							deleteBillingAddressTemplate?.({ billingAddressTemplateId: billingAddress.id })}
						>{$_('common.delete')}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Item.Actions>
</Item.Root>
