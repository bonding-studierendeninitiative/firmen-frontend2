<script lang="ts">
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import * as Dialog from '@/components/ui/dialog';
	import * as Field from '@/components/ui/field';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { createBillingAddressTemplate } from '@/remote/functions';
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
			<Field.Set class=" grid grid-cols-1 gap-6 py-6">
				<input
					{...createBillingAddressTemplate.fields.organizationId.as('hidden', organizationId)}
				/>
				<Field.Field>
					<Field.Label for="company-name"
						>{$_('modules.add-billing-address-template.companyName')}</Field.Label
					>
					<Input
						{...createBillingAddressTemplate.fields.organizationName.as('text')}
						id="company-name"
					/>
					{#each createBillingAddressTemplate.fields.organizationName.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Field>

				<Field.Field>
					<Field.Label for="street-house-no"
						>{$_('modules.add-billing-address-template.streetHouseNo')}</Field.Label
					>
					<Input {...createBillingAddressTemplate.fields.street.as('text')} id="street-house-no" />
					{#each createBillingAddressTemplate.fields.street.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Field>

				<Field.Group class=" grid grid-cols-2 gap-x-4">
					<Field.Field>
						<Field.Label for="postal-code"
							>{$_('modules.add-billing-address-template.postalCode')}</Field.Label
						>
						<Input {...createBillingAddressTemplate.fields.zipCode.as('text')} id="postal-code" />
						{#each createBillingAddressTemplate.fields.zipCode.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Field>
						<Field.Label for="city">{$_('modules.add-billing-address-template.city')}</Field.Label>
						<Input {...createBillingAddressTemplate.fields.city.as('text')} id="city" />
						{#each createBillingAddressTemplate.fields.city.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>
				</Field.Group>

				<Field.Field>
					<Field.Label for="country"
						>{$_('modules.add-billing-address-template.country')}</Field.Label
					>
					<Input {...createBillingAddressTemplate.fields.country.as('text')} id="country" />
					{#each createBillingAddressTemplate.fields.country.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Field>
				<Field.Separator />
				<Field.Field>
					<Field.Label for="vat">{$_('modules.add-billing-address-template.vat')}</Field.Label>
					<Input {...createBillingAddressTemplate.fields.vat.as('text')} id="vat" />
					{#each createBillingAddressTemplate.fields.vat.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Field>
				<Field.Field>
					<Field.Label for="billing-reference"
						>{$_('modules.add-billing-address-template.billingReference')}</Field.Label
					>
					<Input
						{...createBillingAddressTemplate.fields.billingReference.as('text')}
						id="billing-reference"
					/>
					{#each createBillingAddressTemplate.fields.billingReference.issues() ?? [] as issue}
						<div class="text-red-500 text-sm">{issue.message}</div>
					{/each}
				</Field.Field>
			</Field.Set>
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
