<script lang="ts">
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions';
	import type { PageServerData } from './$types';
	import { _, number } from '@services/i18n';
	import { Button as ShadcnButton } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import { Helper } from 'flowbite-svelte';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Checkbox, GradientButton, Button, AddonPackage } from '@/@svelte/components';
	import { Textarea } from '@/components/ui/textarea';
	import { type Infer, intProxy, superForm } from 'sveltekit-superforms';
	import { type CreateEventAddonPackageFormSchema } from '@schema/eventAddonPackages.js';
	import { Separator } from '@/components/ui/separator';
	import { PlusIcon, TrashIcon } from '@/@svelte/icons';
	import { Badge } from '@/components/ui/badge';

	export let data: PageServerData;

	export let isOpen: boolean = false;
	const handleAddSubAddon = (e: Event) => {
		e.preventDefault();
		form.update((oldForm) => ({
			...oldForm,
			addonPackage: {
				...oldForm.addonPackage,
				addons: [
					...oldForm.addonPackage.addons,
					{ title: '', description: '', price: 0, label: '' }
				]
			}
		}), { taint: false });
	};
	const handleRemoveAddon = (index: number) => {
		let subAddonsCopy = [...$form.addonPackage.addons];
		subAddonsCopy.splice(index, 1);
		form.update(() => ({
			...$form, addonPackage: {
				...$form.addonPackage,
				addons: subAddonsCopy
			}
		}), { taint: false });
	};

	const superform = superForm<Infer<CreateEventAddonPackageFormSchema>>(data.addonPackageForm, {
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
			}
		}
	});
	const { form, enhance } = superform;
	const priceProxy = intProxy(superform, 'addonPackage.price', { taint: false, empty: 'null' });
</script>
<div class="flex flex-col gap-6 justify-center">
	<EditBuyOptions form={data.updateForm} />

	<div class="p-6 border rounded-xl">
		<h3 class="font-semibold text-lg">Add-ons</h3>
		{#if data.addonPackages}
			<div class="grid grid-cols-3">
				{#each data.addonPackages as addonPackage}
					<AddonPackage {addonPackage} />
				{/each}
			</div>
		{:else}
			<p>No addon packages</p>
		{/if}
		<Dialog.Root>
			<Dialog.Trigger>
				<ShadcnButton variant="link">Add an addon package</ShadcnButton>
			</Dialog.Trigger>
			<Dialog.Content class="max-h-[90dvh] flex flex-col gap-x-2">
				<Dialog.Header>
					<Dialog.Title>Create a new addon package</Dialog.Title>
				</Dialog.Header>
				<Separator />
				<div class="overflow-y-scroll -m-2 p-2 h-fir">
					<form action="?/createAddonPackage" method="post" use:enhance>
						<Field form={superform} name="addonPackage.title">
							<Control let:attrs>
								<Label>{$_('admin-pages.addons.addonName')}</Label>
								<Input {...attrs} bind:value={$form.addonPackage.title} />
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="addonPackage.label">
							<Control let:attrs>
								<Label>{$_('admin-pages.addons.label')}</Label>
								<Input {...attrs} bind:value={$form.addonPackage.label} />
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="addonPackage.description">
							<Control let:attrs>
								<Label>{$_('admin-pages.addons.packageInformation')}</Label>
								<Textarea {...attrs} bind:value={$form.addonPackage.description} />
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Checkbox name="paddonPackage.urchasable" bind:checked={$form.addonPackage.purchasable}
											label={$_('admin-pages.addons.purchasable')}>
							<Helper slot="description" color="gray">{$_('admin-pages.addons.purchasableDescription')}</Helper>
							<Field form={superform} name="addonPackage.price">
								<Control let:attrs>
									<Input type="number" disabled={!$form.addonPackage.purchasable} {...attrs} bind:value={$priceProxy}
												 placeholder={$_('admin-pages.addons.pricePlaceholder')} />
								</Control>
								<Description />
								<FieldErrors />
							</Field>
						</Checkbox>
						<section class="flex flex-col gap-4">
							{#each $form.addonPackage.addons as _unused, index}
								<div
									class={`border-1 border-stone-400 rounded-xl p-6 relative grid grid-cols-2 gap-4 w-full`}>
									<button
										class="absolute right-3 top-4 text-red-400 text-xs"
										on:click|preventDefault={() => handleRemoveAddon(index)}>
										<TrashIcon />
									</button
									>
									<Field form={superform} name={`addonPackage.addons[${index}].title`}>
										<Control let:attrs>
											<Label>{$_('admin-pages.addons.subAddonName')}</Label>
											<Input {...attrs} bind:value={$form.addonPackage.addons[index].title} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
									<Field form={superform} name={`addonPackage.addons[${index}].price`}>
										<Control let:attrs>
											<Label>{$_('admin-pages.addons.price')}</Label>
											<input
												class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												type="number" {...attrs} bind:value={$form.addonPackage.addons[index].price} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
									<Field form={superform} name={`addonPackage.addons[${index}].description`}>
										<Control let:attrs>
											<Label>{$_('admin-pages.addons.subAddonDescription')}</Label>
											<Input {...attrs} bind:value={$form.addonPackage.addons[index].description} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
									<Field form={superform} name={`addonPackage.addons[${index}].label`}>
										<Control let:attrs>
											<Label>{$_('admin-pages.addons.label')}</Label>
											<Input {...attrs} bind:value={$form.addonPackage.addons[index].label} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
								</div>
							{/each}
						</section>
						<div>
							<ShadcnButton variant="link" class="!font-semibold" on:click={handleAddSubAddon}>
								<PlusIcon classes="mr-2" />{$_('admin-pages.addons.addSubAddon')}
							</ShadcnButton>
						</div>
						<footer class=" mt-10 flex justify-end items-center mb-4 gap-x-2">
							<Button
								onClick={() => {
							isOpen = false;
						}}
							>{$_('common.cancel')}
							</Button>
							<GradientButton type="submit">{$_('common.save')}</GradientButton>
						</footer>
						<pre>{JSON.stringify($form, null, 2)}</pre>
					</form>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
