<script lang="ts">
	import { _ } from '@services';
	import { Button, Checkbox, Drawer, GradientButton, Link } from '$lib/@svelte/components';
	import PlusIcon from '$lib/@svelte/icons/PlusIcon.svelte';
	import TrashIcon from '$lib/@svelte/icons/TrashIcon.svelte';
	import type {
		CreateAddonPackageTemplateFormSchema
	} from '@schema/addonPackageTemplates';
	import { type Infer, intProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Field, Control, Label, Description, FieldErrors } from '@/components/ui/form';
	import { Helper } from 'flowbite-svelte';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { CreatePortraitTemplateRequestSchema } from '@/services';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';

	export let validated: SuperValidated<Infer<CreateAddonPackageTemplateFormSchema>>;

	export let isOpen: boolean = false;
	const handleAddSubAddon = (e: Event) => {
		e.preventDefault();
		form.update((oldForm) => ({
			...oldForm,
			addons: [
				...oldForm.addons,
				{ title: '', description: '', price: 0, label: '' }
			]
		}), { taint: false });
	};
	const handleRemoveAddon = (index: number) => {
		let subAddonsCopy = [...$form.addons];
		subAddonsCopy.splice(index, 1);
		form.update(() => ({ ...$form, addons: subAddonsCopy }), { taint: false });
	};

	const superform = superForm(validated, {
		validators: valibotClient(CreatePortraitTemplateRequestSchema),
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				isOpen = false;
			}
		}
	});
	const { form, enhance } = superform;
	const priceProxy = intProxy(superform, 'price', { taint: false, empty: 'null' });
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.addons.newAddons')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<form action="?/createAddonPackage" method="post" use:enhance>
		<Field form={superform} name="title">
			<Control let:attrs>
				<Label>{$_('admin-pages.addons.addonName')}</Label>
				<Input {...attrs} bind:value={$form.title} />
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="label">
			<Control let:attrs>
				<Label>{$_('admin-pages.addons.saleTag')}</Label>
				<Input {...attrs} bind:value={$form.label} />
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Field form={superform} name="description">
			<Control let:attrs>
				<Label>{$_('admin-pages.addons.packageInformation')}</Label>
				<Textarea {...attrs} bind:value={$form.description} />
			</Control>
			<Description />
			<FieldErrors />
		</Field>
		<Checkbox name="purchasable" bind:checked={$form.purchasable} label={$_('admin-pages.addons.purchasable')}>
			<Helper slot="description" color="gray">{$_('admin-pages.addons.purchasableDescription')}</Helper>
			<Field form={superform} name="price">
				<Control let:attrs>
					<Input type="number" disabled={!$form.purchasable} {...attrs} bind:value={$priceProxy}
								 placeholder={$_('admin-pages.addons.pricePlaceholder')} />
				</Control>
				<Description />
				<FieldErrors />
			</Field>
		</Checkbox>
		<section class="flex flex-col gap-4">
			{#each $form.addons as _unused, index}
				<div
					class={`border-1 border-stone-400 rounded-xl p-6 relative grid grid-cols-2 gap-4 w-full`}>
					<button
						class="absolute right-3 top-4 text-red-400 text-xs"
						on:click|preventDefault={() => handleRemoveAddon(index)}>
						<TrashIcon />
					</button
					>
					<Field form={superform} name={`addons[${index}].title`}>
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.subAddonName')}</Label>
							<Input {...attrs} bind:value={$form.addons[index].title} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Field form={superform} name={`addons[${index}].price`}>
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.price')}</Label>
							<Input type="number" {...attrs} bind:value={$form.addons[index].price} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Field form={superform} name={`addons[${index}].description`}>
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.description')}</Label>
							<Input {...attrs} bind:value={$form.addons[index].description} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
					<Field form={superform} name={`addons[${index}].label`}>
						<Control let:attrs>
							<Label>{$_('admin-pages.addons.label')}</Label>
							<Input {...attrs} bind:value={$form.addons[index].label} />
						</Control>
						<Description />
						<FieldErrors />
					</Field>
				</div>
			{/each}
		</section>
		<div>
			<Link classes=" flex items-center !font-semibold" onClick={handleAddSubAddon}
			>
				<PlusIcon classes="mr-2" />{$_('admin-pages.addons.addSubAddon')}</Link
			>
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
</Drawer>
