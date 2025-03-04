<script lang="ts">
	import { _ } from '@services';
	import { PencilSquareIcon } from '$lib/@svelte/icons';
	import type {
		BillingAddressTemplate,
		DeleteBillingAddressTemplateForm,
		MakeBillingAddressTemplateDefaultForm
	} from '@schema';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Trash } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import toast from 'svelte-french-toast';
	import * as Dialog from "@/components/ui/dialog"
	import { invalidate } from '$app/navigation';

	export let isDefault: boolean;
	export let billingAddress: Infer<BillingAddressTemplate>;
	let isDeleteFormOpen = false;
	export let deleteBillingAddressTemplateForm: SuperValidated<Infer<DeleteBillingAddressTemplateForm>>;
	export let makeBillingAddressTemplateDefaultForm: SuperValidated<Infer<MakeBillingAddressTemplateDefaultForm>>;
	const { enhance: deleteEnhance } = superForm(deleteBillingAddressTemplateForm, {
		onResult({ result }) {
			if (result.type === 'success') {
				isDeleteFormOpen = false;
				toast.success('Address deleted successfully');
			}
		},
		invalidateAll: true
	});
	const { enhance: makeDefaultEnhance } = superForm(makeBillingAddressTemplateDefaultForm, {
		async onResult({ result }) {
			if (result.type === 'success') {
				toast.success('Address successfully set as default');
				await invalidate('organization');
			}
		}
	});
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
				<form action="?/makeBillingAddressTemplateDefault" method="post" use:makeDefaultEnhance>
					<input type="hidden" name="billingAddressTemplateId" value={billingAddress.id}>
				<Button class="mx-6" on:click={() => undefined} type="submit">{$_('user-pages.settings.makeItDefault')}</Button>
				</form>
			{/if}
			<button class="text-stone-500"><PencilSquareIcon /></button>
			<Dialog.Root bind:open={isDeleteFormOpen} on:close={() => (isDeleteFormOpen = false)}>
				<Dialog.Trigger>
					<button class="text-stone-500"><Trash /></button>
				</Dialog.Trigger>
				<Dialog.Content>
					<form action="?/deleteBillingAddressTemplate" method="post" use:deleteEnhance>
						<Dialog.Title>{$_('user-pages.settings.deleteAddress')}</Dialog.Title>
						<Dialog.Description>
							{$_('user-pages.settings.deleteAddressDescription')}
						</Dialog.Description>
								<input name="billingAddressTemplateId" type="hidden" value={billingAddress.id} />
						<Dialog.Footer>
							<Button variant="secondary" on:click={() => undefined}>
								{$_('common.cancel')}
							</Button>
							<Button variant="destructive" type="submit">{$_("common.delete")}</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</span>
	</div>
</div>
