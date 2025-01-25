<script lang="ts">
	import { Button, Control, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Separator } from '@/components/ui/separator';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Input } from '@/components/ui/input';
	import { _ } from '@services';
	import * as Dialog from '@/components/ui/dialog';
	import { CreateBillingAddressTemplateForm as formSchema, type CreateBillingAddressTemplateForm } from '@schema';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';
	import { buttonVariants } from '@/components/ui/button';

	export let createBillingAddressTemplateForm: SuperValidated<Infer<CreateBillingAddressTemplateForm>>;

	const superform = superForm<Infer<CreateBillingAddressTemplateForm>>(createBillingAddressTemplateForm, {
		validators: valibotClient(formSchema),
		onResult({ result }) {
			if (result.type === 'success') {
				open = false;
				toast.success($_('modules.add-billing-address-template.billingAddressAddedSuccessfully'));
			} else if (result.type === 'error') {
				toast.error(result.error);
			}
		}
	});
	const { form: formData, enhance } = superform;

	let open: boolean = false;
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Trigger class={buttonVariants({ variant: "gradient" })}>
		{$_('modules.add-billing-address-template.addBillingAddress')}
	</Dialog.Trigger>
	<form id="create-billing-address-template-form" action="?/createBillingAddressTemplate" use:enhance
				method="post">
		<Dialog.Content>

			<Dialog.Header>
				<Dialog.Title>{$_('modules.add-billing-address-template.newAddress')}</Dialog.Title>
			</Dialog.Header>
			<div class=" grid grid-cols-1 gap-6">
				<Field form={superform} name="organizationName">
					<Control let:attrs>
						<Label>{$_('modules.add-billing-address-template.companyName')}</Label>
						<Input {...attrs} bind:value={$formData.organizationName} />
					</Control>
					<FieldErrors />
				</Field>
				<Field form={superform} name="street">
					<Control let:attrs>
						<Label>{$_('modules.add-billing-address-template.streetHouseNo')}</Label>
						<Input {...attrs} bind:value={$formData.street} />
					</Control>
					<FieldErrors />
				</Field>
				<div class=" grid grid-cols-2 gap-x-4">
					<Field form={superform} name="zipCode">
						<Control let:attrs>
							<Label>{$_('modules.add-billing-address-template.postalCode')}</Label>
							<Input {...attrs} bind:value={$formData.zipCode} />
						</Control>
						<FieldErrors />
					</Field>
					<Field form={superform} name="city">
						<Control let:attrs>
							<Label>{$_('modules.add-billing-address-template.city')}</Label>
							<Input {...attrs} bind:value={$formData.city} />
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<Field form={superform} name="country">
					<Control let:attrs>
						<Label>{$_('modules.add-billing-address-template.country')}</Label>
						<Input {...attrs} bind:value={$formData.country} />
					</Control>
					<FieldErrors />
				</Field>
				<Separator />
				<Field form={superform} name="vat">
					<Control let:attrs>
						<Label>{$_('modules.add-billing-address-template.vat')}</Label>
						<Input {...attrs} bind:value={$formData.vat} />
					</Control>
					<FieldErrors />
				</Field>
				<Field form={superform} name="billingReference">
					<Control let:attrs>
						<Label>{$_('modules.add-billing-address-template.billingReference')}</Label>
						<Input {...attrs} bind:value={$formData.billingReference} />
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" class="mr-2" on:click={() => (open = false)}
				>{$_('common.cancel')}</Button
				>
				<Button form="create-billing-address-template-form" variant="gradient" type="submit"
				>{$_('modules.add-billing-address-template.addAddress')}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>