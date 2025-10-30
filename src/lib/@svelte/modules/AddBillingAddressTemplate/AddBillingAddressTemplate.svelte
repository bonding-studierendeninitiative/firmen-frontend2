<script lang="ts">
	import { Separator } from '@/components/ui/separator';
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import * as Dialog from '@/components/ui/dialog';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { createBillingAddressTemplate } from '@/remote/functions';
	import { Label } from '@/components/ui/label';
	import { cn } from '@/utils';

	let open: boolean = $state(false);
	let { organizationId = '' } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		{$_('modules.add-billing-address-template.addBillingAddress')}
	</Dialog.Trigger>
	<Dialog.Content>
		<form id="create-billing-address-template-form" {...createBillingAddressTemplate}>
			<Dialog.Header>
				<Dialog.Title>{$_('modules.add-billing-address-template.newAddress')}</Dialog.Title>
			</Dialog.Header>
			<div class=" grid grid-cols-1 gap-6 py-6">
				<input
					{...createBillingAddressTemplate.fields.organizationId.as('hidden', organizationId)}
				/>
				<div>
					<Label>{$_('modules.add-billing-address-template.companyName')}</Label>
					<Input {...createBillingAddressTemplate.fields.organizationName.as('text')} />
					{#each createBillingAddressTemplate.fields.organizationName.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>

				<div>
					<Label>{$_('modules.add-billing-address-template.streetHouseNo')}</Label>
					<Input {...createBillingAddressTemplate.fields.street.as('text')} />
					{#each createBillingAddressTemplate.fields.street.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>

				<div class=" grid grid-cols-2 gap-x-4">
					<div>
						<Label>{$_('modules.add-billing-address-template.postalCode')}</Label>
						<Input {...createBillingAddressTemplate.fields.zipCode.as('text')} />
						{#each createBillingAddressTemplate.fields.zipCode.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</div>

					<div>
						<Label>{$_('modules.add-billing-address-template.city')}</Label>
						<Input {...createBillingAddressTemplate.fields.city.as('text')} />
						{#each createBillingAddressTemplate.fields.city.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</div>
				</div>

				<div>
					<Label>{$_('modules.add-billing-address-template.country')}</Label>
					<Input {...createBillingAddressTemplate.fields.country.as('text')} />
					{#each createBillingAddressTemplate.fields.country.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>
				<Separator />
				<div>
					<Label>{$_('modules.add-billing-address-template.vat')}</Label>
					<Input {...createBillingAddressTemplate.fields.vat.as('text')} />
					{#each createBillingAddressTemplate.fields.vat.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>
				<div>
					<Label>{$_('modules.add-billing-address-template.billingReference')}</Label>
					<Input {...createBillingAddressTemplate.fields.billingReference.as('text')} />
					{#each createBillingAddressTemplate.fields.billingReference.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close class={cn(buttonVariants({ variant: 'outline' }), 'mr-2')}>
					{$_('common.cancel')}
				</Dialog.Close>
				<Button form="create-billing-address-template-form" type="submit">
					{$_('modules.add-billing-address-template.addAddress')}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
