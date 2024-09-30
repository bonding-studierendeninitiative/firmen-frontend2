<script lang="ts">
	import { _ } from '@services';
	import {
		Drawer,
		IconInput,
		Input,
		Select,
		Textarea
	} from '$lib/@svelte/components';
	import { addPackageSchema } from '@schema';
	import type { PackageFieldTypes } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';
	import { PlusIcon, TrashIcon } from '$lib/@svelte/icons';
	import { Button } from '@/components/ui/button';

	export let isOpen: boolean = false;

	let isSubmitted = false;
	const initialData: PackageFieldTypes = {
		packageName: '',
		price: '',
		taxes: '',
		included: null,
		serviceTitle: '',
		services: []
	};
	let formData = {
		...initialData
	};
	let errors: any;

	$: {
		formData;
		validateData();
	}

	const validateData = () => {
		if (!isSubmitted) return;
		const validate = addPackageSchema.safeParse(formData);
		errors = formatZodErrors(validate);
	};

	const handleFormSubmit = async () => {
		isSubmitted = true;
		validateData();
		if (errors) return;
		isOpen = false;
	};
	const resetForm = () => {
		isSubmitted = false;
		errors = {};
		formData = { ...initialData };
	};
	$: {
		if (!isOpen) {
			resetForm();
		}
	}

	const handleCancel = () => {
		isOpen = false;
	};

	const service = { serviceTitle: '', digit: '', included: null };

	const handleAddService = () => {
		let formDataCopy = { ...formData };
		let formDataCopyServices = [...formDataCopy.services];
		formDataCopyServices = [...formDataCopyServices, { ...service }];
		formDataCopy.services = [...formDataCopyServices];
		formData = { ...formDataCopy };
	};

	const handleRemoveService = (index: number) => {
		let formDataCopy = { ...formData };
		let formDataCopyServices = [...formDataCopy.services];
		formDataCopyServices.splice(index, 1);
		formDataCopy.services = [...formDataCopyServices];
		formData = { ...formDataCopy };
	};
	$: console.log({ errors });
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.packages.newPackage')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<div class="grid grid-cols-1 gap-4 w-full">
		<Input
			label={$_('admin-pages.packages.packageName')}
			bind:value={formData.packageName}
			errorMessage={errors?.packageName}
		/>
		<div class="grid grid-cols-2 gap-4 w-full">
			<IconInput
				iconType="endIcon"
				label={$_('admin-pages.packages.price')}
				placeholder="0000"
				bind:value={formData.price}
				errorMessage={errors?.price}
			>
				<span slot="icon" class=" text-stone-500 h-auto p-0 m-0">€</span>
			</IconInput>
			<Select
				label={$_('admin-pages.packages.taxes')}
				bind:value={formData.taxes}
				errorMessage={errors?.taxes}
			/>
		</div>
		<div class="grid grid-cols-2 gap-4 w-full">
			<Textarea
				label={$_('admin-pages.packages.serviceTitle')}
				bind:value={formData.serviceTitle}
				errorMessage={errors?.serviceTitle}
			/>
			<Select
				label={$_('admin-pages.packages.included')}
				bind:value={formData.included}
				errorMessage={errors?.included?.included}
			/>
		</div>
		<hr />
		<section>
			{#each formData.services as service, index (service)}
				<div class={` relative grid grid-cols-2 gap-4 w-full  ${index !== 0 ? 'mt-2' : ''}`}>
					<button
						class="absolute right-0 top-0 text-red-400 text-xs"
						on:click={() => handleRemoveService(index)}><TrashIcon /></button
					>
					<Input
						label={$_('admin-pages.packages.serviceTitle')}
						classes="col-span-2"
						bind:value={formData.services[index].serviceTitle}
						errorMessage={errors?.services?.[index]?.serviceTitle}
					/>
					<span class="flex items-start w-full col-span-1">
						<span class=" mr-2 w-2/5"
							><Select
								label={$_('admin-pages.packages.included')}
								bind:value={formData.services[index].included}
								errorMessage={errors?.services?.[index]?.included?.included}
							/></span
						>
						<span class=" mr-2 w-3/5"
							><Input
								label={$_('admin-pages.packages.digit')}
								bind:value={formData.services[index].digit}
								errorMessage={errors?.services?.[index]?.digit}
							/></span
						>
					</span>
				</div>
			{/each}
		</section>
		<div id="addServiceButton">
			<Button variant="link" class=" flex items-center !font-semibold" on:click={handleAddService}>
				<PlusIcon classes="mr-2" />
				{$_('admin-pages.packages.addNewService')}
			</Button>
		</div>
	</div>
	<footer class=" flex justify-end items-center w-full">
		<Button class="mr-2" on:click={handleCancel}>{$_('common.cancel')}</Button>
		<Button variant="gradient" on:click={handleFormSubmit}>{$_('common.save')}</Button>
	</footer>
</Drawer>
