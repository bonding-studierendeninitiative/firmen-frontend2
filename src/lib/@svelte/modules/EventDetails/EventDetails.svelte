<script lang="ts">
	import { _ } from '@services';
	import {
		Datepicker,
		Drawer,
		Input,
		Select,
		Badge,
		Button,
		GradientButton
	} from '$lib/@svelte/components';
	import { eventDetailSchema } from '@schema';
	import type { eventDetailTypes } from '@schema';
	import { formatZodErrors } from '$lib/utils/formatZodErrors';

	export let isOpen: boolean = false;
	export let showActions: boolean = false;
	const packages = ['light', 'standard', 'premium'];
	const addons = ['Onlinewerbung-Paket', 'Printwerbung-Paket', 'Bonding-Tüte', 'Sonstiges'];

	let isSubmitted = false;
	const initialData: eventDetailTypes = {
		eventName: '',
		city: null,
		streetAndNumber: '',
		university: '',
		startDate: '',
		endDate: '',
		startTime: '',
		endTime: '',
		specialties: [],
		eventTemplate: null,
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
		const validate = eventDetailSchema.safeParse(formData);
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
	heading={$_('admin-pages.events.eventDetails')}
	handleSubmit={handleFormSubmit}
	hasActions={false}
>
	<div class="grid grid-cols-1 gap-4 w-full max-h-[690px] pb-8">
		<Input
			label={$_('admin-pages.events.eventName')}
			bind:value={formData.eventName}
			errorMessage={errors?.eventName}
		/>
		<div class="grid grid-cols-2 gap-4 w-full">
			<Select
				label={$_('common.city')}
				bind:value={formData.city}
				errorMessage={errors?.city?.city}
			/>
			<Input
				label={$_('admin-pages.events.street&Number')}
				bind:value={formData.streetAndNumber}
				errorMessage={errors?.streetAndNumber}
			/>
		</div>
		<Input
			label={$_('admin-pages.events.nameOfUniversity')}
			bind:value={formData.university}
			errorMessage={errors?.university}
		/>
		<div class="grid grid-cols-2 gap-4 w-full">
			<Datepicker
				label={$_('admin-pages.events.startDate')}
				bind:value={formData.startDate}
				errorMessage={errors?.startDate}
			/>
			<Datepicker
				label={$_('admin-pages.events.endDate')}
				bind:value={formData.endDate}
				errorMessage={errors?.endDate}
			/>
		</div>
		<div class="grid grid-cols-2 gap-4 w-full mt-0">
			<Datepicker
				label={$_('admin-pages.events.startTime')}
				type="time"
				bind:value={formData.startTime}
				errorMessage={errors?.startTime}
			/>
			<Datepicker
				label={$_('admin-pages.events.endTime')}
				type="time"
				bind:value={formData.endTime}
				errorMessage={errors?.endTime}
			/>
		</div>
		<Select
			label={$_('admin-pages.events.specialties')}
			bind:value={formData.specialties}
			errorMessage={errors?.specialties}
			isMultiple
		/>
		<Select
			label={$_('admin-pages.events.eventTemplate')}
			bind:value={formData.eventTemplate}
			errorMessage={errors?.eventTemplate}
		/>
		<Select
			label={$_('common.packages')}
			bind:value={formData.packages}
			errorMessage={errors?.packages}
			isMultiple
		/>
		<div class=" flex items-center flex-wrap gap-1">
			{#each packages as pkg (pkg)}
				<Badge isClearable>{$_(`common.${pkg}`)}</Badge>
			{/each}
		</div>
		<Select
			label={$_('common.addons')}
			bind:value={formData.addons}
			errorMessage={errors?.addons}
			isMultiple
		/>
		<div class=" flex items-center flex-wrap gap-1">
			{#each addons as addon (addon)}
				<div class=" mr-2">
					<Badge isClearable>{addon}</Badge>
				</div>
			{/each}
		</div>
		{#if showActions}
			<footer class=" flex justify-end items-center w-full pb-4">
				<Button classes="mr-2" onClick={handleCancel}>{$_('common.cancel')}</Button>
				<GradientButton onClick={handleFormSubmit}>{$_('common.save')}</GradientButton>
			</footer>
		{/if}
	</div>
</Drawer>
