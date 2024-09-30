<script lang="ts">
	import { _ } from '@services';
	import { Drawer, Input, Select, Textarea } from '$lib/@svelte/components';
	export let isOpen: boolean = false;
	import { addCategorySchema } from '@schema';
	import type { categoryFieldTypes } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';
	import { Button } from '@/components/ui/button';

	let isSubmitted = false;
	const initialData: categoryFieldTypes = {
		categoryName: '',
		categoryInformation: '',
		packages: [],
		addons: []
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
		const validate = addCategorySchema.safeParse(formData);
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
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.categories.newCategory')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<div class="grid grid-cols-1 gap-4 w-full">
		<Input
			label={$_('admin-pages.categories.categoryName')}
			bind:value={formData.categoryName}
			errorMessage={errors?.categoryName}
		/>
		<Textarea
			label={$_('admin-pages.categories.categoryInformation')}
			bind:value={formData.categoryInformation}
			errorMessage={errors?.categoryInformation}
		/>
		<Select
			placeholder={$_('admin-pages.categories.selectPackages')}
			label={$_('common.packages')}
			isMultiple
			bind:value={formData.packages}
			errorMessage={errors?.packages}
		/>
		<Select
			placeholder={$_('admin-pages.categories.selectAddons')}
			label={$_('common.addons')}
			bind:value={formData.addons}
			errorMessage={errors?.addons}
			isMultiple
		/>
	</div>
	<footer class=" flex justify-end items-center w-full">
		<Button variant="secondary" class="mr-2" on:click={handleCancel}>{$_('common.cancel')}</Button>
		<Button variant="gradient" on:click={handleFormSubmit}>{$_('common.save')}</Button>
	</footer>
</Drawer>
