<script lang="ts">
	import { Button, Control, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Separator } from '@/components/ui/separator';
	import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import * as Dialog from '@/components/ui/dialog';
	import {
		CreateBillingAddressTemplateForm as formSchema,
		type CreateBillingAddressTemplateForm
	} from '@schema';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '@/components/ui/button';

	interface Props {
		createBillingAddressTemplateForm: SuperValidated<Infer<CreateBillingAddressTemplateForm>>;
	}

	let { createBillingAddressTemplateForm }: Props = $props();

	const superform = superForm<Infer<CreateBillingAddressTemplateForm>>(
		createBillingAddressTemplateForm,
		{
			validators: valibotClient(formSchema),
			dataType: 'json',
			onResult({ result }) {
				if (result.type === 'success') {
					open = false;
					toast.success($_('modules.add-billing-address-template.billingAddressAddedSuccessfully'));
				} else if (result.type === 'error') {
					toast.error(result.error);
				}
			}
		}
	);
	const { form: formData, enhance } = superform;

	let open: boolean = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		{$_('modules.add-billing-address-template.addBillingAddress')}
	</Dialog.Trigger>
	<form
		id="create-billing-address-template-form"
		action="?/createBillingAddressTemplate"
		use:enhance
		method="post"
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{$_('modules.add-billing-address-template.newAddress')}</Dialog.Title>
			</Dialog.Header>
			<div class=" grid grid-cols-1 gap-6">
				<Field form={superform} name="organizationName">
					<Control>
						{#snippet children({ props })}
							<Label>{$_('modules.add-billing-address-template.companyName')}</Label>
							<Input {...props} bind:value={$formData.organizationName} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<Field form={superform} name="street">
					<Control>
						{#snippet children({ props })}
							<Label>{$_('modules.add-billing-address-template.streetHouseNo')}</Label>
							<Input {...props} bind:value={$formData.street} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<div class=" grid grid-cols-2 gap-x-4">
					<Field form={superform} name="zipCode">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('modules.add-billing-address-template.postalCode')}</Label>
								<Input {...props} bind:value={$formData.zipCode} />
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>
					<Field form={superform} name="city">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('modules.add-billing-address-template.city')}</Label>
								<Input {...props} bind:value={$formData.city} />
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<Field form={superform} name="country">
					<Control>
						{#snippet children({ props })}
							<Label>{$_('modules.add-billing-address-template.country')}</Label>
							<Input {...props} bind:value={$formData.country} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<Separator />
				<Field form={superform} name="vat">
					<Control>
						{#snippet children({ props })}
							<Label>{$_('modules.add-billing-address-template.vat')}</Label>
							<Input {...props} bind:value={$formData.vat} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<Field form={superform} name="billingReference">
					<Control>
						{#snippet children({ props })}
							<Label>{$_('modules.add-billing-address-template.billingReference')}</Label>
							<Input {...props} bind:value={$formData.billingReference} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" class="mr-2" onclick={() => (open = false)}
					>{$_('common.cancel')}</Button
				>
				<Button form="create-billing-address-template-form" variant="gradient" type="submit"
					>{$_('modules.add-billing-address-template.addAddress')}</Button
				>
			</Dialog.Footer>
			<SuperDebug data={formData} />
		</Dialog.Content>
	</form>
</Dialog.Root>
