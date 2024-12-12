<script lang="ts">
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form/index.js';
	import { Textarea } from '@/components/ui/textarea/index.js';
	import { Checkbox } from '@/@svelte/components/index.js';
	import { Separator } from '@/components/ui/separator/index.js';
	import { Input } from '@/components/ui/input/index.js';
	import { Helper } from 'flowbite-svelte';
	import { PlusIcon, TrashIcon } from '@/@svelte/icons/index.js';
	import { _ } from '@services/i18n';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { type Infer, intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type CreateEventAddonPackageFormSchema } from '@schema/eventAddonPackages.js';
	import { ScrollArea } from '@/components/ui/scroll-area';

	export let isOpen: boolean = false;
	const handleAddSubAddon = (e: Event) => {
		e.preventDefault();
		form.update(
			(oldForm) => ({
				...oldForm,
				addonPackage: {
					...oldForm.addonPackage,
					addons: [
						...oldForm.addonPackage.addons,
						{ title: '', description: '', price: 0, label: '' }
					]
				}
			}),
			{ taint: false }
		);
	};
	const handleRemoveAddon = (index: number) => {
		let subAddonsCopy = [...$form.addonPackage.addons];
		subAddonsCopy.splice(index, 1);
		form.update(
			() => ({
				...$form,
				addonPackage: {
					...$form.addonPackage,
					addons: subAddonsCopy
				}
			}),
			{ taint: false }
		);
	};

	export let createAddonPackageForm: SuperValidated<Infer<CreateEventAddonPackageFormSchema>>;

	const superform = superForm(createAddonPackageForm, {
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
			} else {
				console.log(result);
			}
		}
	});
	const { form, enhance, formId } = superform;
	const priceProxy = intProxy(superform, 'addonPackage.price', { taint: false, empty: 'null' });
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<Button variant="link">{$_("admin-pages.addons.add")}</Button>
	</Dialog.Trigger>
	<Dialog.Content class="flex flex-col gap-y-4 max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>{$_("admin-pages.addons.title")}</Dialog.Title>
		</Dialog.Header>
		<Separator />
		<form id={$formId} class="@container" action="?/createAddonPackage" method="post" use:enhance>
			<ScrollArea class="h-[60dvh]">
				<div class="-m-2 px-4 py-2 h-max flex flex-col gap-4 @lg:grid @lg:grid-cols-3">
					<Field class="@lg:col-span-2" form={superform} name="addonPackage.title">
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.addonName')}</Label>
							<Input {...attrs} bind:value={$form.addonPackage.title} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Field class="@lg:col-span-1" form={superform} name="addonPackage.label">
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.label')}</Label>
							<Input {...attrs} bind:value={$form.addonPackage.label} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Field class="col-span-2" form={superform} name="addonPackage.description">
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.packageInformation')}</Label>
							<Textarea {...attrs} bind:value={$form.addonPackage.description} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Checkbox
						containerClass="col-span-1"
						name="paddonPackage.purchasable"
						bind:checked={$form.addonPackage.purchasable}
						label={$_('admin-pages.addons.purchasable')}
					>
						<Helper color="gray">{$_('admin-pages.addons.purchasableDescription')}</Helper>
						<Field slot="description" form={superform} name="addonPackage.price">
							<Control let:attrs>
								<Input
									type="number"
									required={!$form.addonPackage.purchasable}
									disabled={!$form.addonPackage.purchasable}
									{...attrs}
									bind:value={$priceProxy}
									placeholder={$_('admin-pages.addons.pricePlaceholder')}
								/>
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</Checkbox>
					<section class="col-span-3">
						<fieldset class="border border-stone-300 rounded-lg p-4">
							<legend class="px-2 text-sm font-semibold">{$_("common.addons")}</legend>
							<div class="space-y-2">
								{#each $form.addonPackage.addons as _unused, index}
									<div class={`p-2 relative grid grid-cols-2 gap-4 w-full`}>
										<button
											class="absolute right-3 top-4 text-red-500 hover:text-red-700 text-xs"
											on:click|preventDefault={() => handleRemoveAddon(index)}
										>
											<TrashIcon />
										</button>
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
													type="number"
													{...attrs}
													bind:value={$form.addonPackage.addons[index].price}
												/>
											</Control>
											<Description />
											<FieldErrors />
										</Field>
										<Field form={superform} name={`addonPackage.addons[${index}].description`}>
											<Control let:attrs>
												<Label>{$_('admin-pages.addons.subAddonDescription')}</Label>
												<Input
													{...attrs}
													bind:value={$form.addonPackage.addons[index].description}
												/>
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
									{#if index < $form.addonPackage.addons.length - 1}
										<Separator class="-mx-4 mr-auto" />
									{/if}
								{/each}
							</div>
							<Button variant="link" class="!font-semibold" on:click={handleAddSubAddon}>
								<PlusIcon classes="mr-2" />{$_('admin-pages.addons.addSubAddon')}
							</Button>
						</fieldset>
					</section>
					<!--<pre>{JSON.stringify($form, null, 2)}</pre>-->
				</div>
			</ScrollArea>
		</form>
		<Dialog.Footer class="flex justify-end items-center gap-x-2 col-span-3">
			<Button
				variant="secondary"
				on:click={() => {
					isOpen = false;
				}}
				>{$_('common.cancel')}
			</Button>
			<Button form={$formId} variant="gradient" type="submit">{$_('common.save')}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
