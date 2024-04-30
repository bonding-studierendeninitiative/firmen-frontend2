<script lang="ts">
	import { _ } from '@services';
	import { Input, Select, Badge, Button } from '$lib/@svelte/components';
	import Checkbox from '$lib/@svelte/components/Checkbox/Checkbox.svelte';
	import GradientButton from '$lib/@svelte/components/GradientButton/GradientButton.svelte';
	import IconInput from '$lib/@svelte/components/IconInput/IconInput.svelte';
	import Textarea from '$lib/@svelte/components/Textarea/Textarea.svelte';

	export let isOpen: boolean = false;

	const disciplines = [
		'Bauingenieurwesen',
		'Elektrotechnik',
		'Informatik',
		'Kommunikationswissenschaften',
		'Maschinenbau',
		'Technische Informatik'
	];

	let currentStep = 1;

	$: isOpen, (currentStep = 1);
</script>

<div class="grid grid-cols-1 gap-y-4 w-full">
	<div class=" grid grid-cols-2 gap-x-4">
		<Input label={$_('user-pages.portraits.nameOfPortrait')} />
		<Input label={$_('user-pages.portraits.comments')} />
	</div>
	<div class=" grid grid-cols-3 gap-x-4">
		<Select
			label={$_('user-pages.portraits.branch')}
			placeholder={$_('user-pages.portraits.selectAnyBranch')}
		/>
		<Input label={$_('user-pages.portraits.company')} />
		<Input label={$_('user-pages.portraits.companyOrganizationChart')} />
	</div>

	<Textarea label={$_('user-pages.portraits.products')} />
	<div>
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
			>{$_('user-pages.portraits.locations')}</label
		>
		<div
			id="Locations"
			class=" grid grid-cols-3 gap-x-4 border border-stone-200 py-2 px-3 rounded-lg mb-2"
		>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.all')} />
			</div>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.inland')} />
			</div>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.international')} />
			</div>
		</div>
		<Select placeholder={$_('user-pages.portraits.cities')} />
	</div>
	<hr class=" border border-stone-200 my-2" />

	<div>
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="salesVolume"
			>{$_('user-pages.portraits.salesVolume')}</label
		>
		<div
			id="salesVolume"
			class=" grid grid-cols-3 gap-x-4 border border-stone-200 py-2 px-3 rounded-lg mb-2"
		>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.all')} />
			</div>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.inland')} />
			</div>
			<div class=" border-r border-stone-200">
				<Checkbox label={$_('user-pages.portraits.international')} />
			</div>
		</div>
		<Select placeholder={$_('user-pages.portraits.cities')} />
	</div>
	<hr class=" border border-stone-200 my-2" />
	<IconInput iconType="startIcon" label={$_('user-pages.portraits.numberOfEmployees')}>
		<span slot="icon-start">{$_('user-pages.portraits.inland')}</span>
	</IconInput>
	<IconInput iconType="startIcon">
		<span slot="icon-start">{$_('user-pages.portraits.eu')}</span>
	</IconInput>
	<IconInput iconType="startIcon">
		<span slot="icon-start">{$_('user-pages.portraits.global')}</span>
	</IconInput>
	<Input label={$_('user-pages.portraits.universityGraduates')} />
	<Input label={$_('user-pages.portraits.desiredDisciplines')} />
	<div class=" flex items-center flex-wrap gap-1">
		{#each disciplines as discipline (discipline)}
			<div class=" mr-2">
				<Badge isClearable>{discipline}</Badge>
			</div>
		{/each}
	</div>
	<Textarea label={$_('user-pages.portraits.entryOpportunities')} />
	<div class=" grid grid-cols-3 gap-x-4">
		<div>
			<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="internships"
				>{$_('user-pages.portraits.internships')}</label
			>
			<div
				id="internships"
				class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
			>
				<div class=" border-r border-stone-200">
					<Checkbox label={$_('common.yes')} labelClasses="py-2" />
				</div>
				<div><Checkbox label={$_('common.no')} labelClasses="py-2" /></div>
			</div>
		</div>
		<div>
			<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="study"
				>{$_('user-pages.portraits.studyDiploma')}
			</label>
			<div
				id="study"
				class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
			>
				<div class=" border-r border-stone-200">
					<Checkbox label={$_('common.yes')} labelClasses="py-2" />
				</div>
				<div><Checkbox label={$_('common.no')} labelClasses="py-2" /></div>
			</div>
		</div>
		<div>
			<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
				>{$_('user-pages.portraits.foreignAssignment')}</label
			>
			<div
				id="Locations"
				class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
			>
				<div class=" border-r border-stone-200">
					<Checkbox label={$_('common.yes')} labelClasses="py-2" />
				</div>
				<div><Checkbox label={$_('common.no')} labelClasses="py-2" /></div>
			</div>
		</div>
	</div>

	<hr class=" border border-stone-200 my-2" />
	<div class=" grid grid-cols-1 gap-2">
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
			>{$_('user-pages.portraits.contactAddress')}</label
		>
		<div class=" grid grid-cols-2 gap-4">
			<Input placeholder={$_('user-pages.portraits.companyName')} />
			<Input placeholder={$_('user-pages.portraits.companyAddress')} />
		</div>
		<div class=" grid grid-cols-3 gap-x-4">
			<Input placeholder={$_('user-pages.portraits.branch')} />
			<Input placeholder={$_('user-pages.portraits.city')} />
			<Input placeholder={$_('user-pages.portraits.zipCode')} />
		</div>
	</div>

	<div>
		<label
			class="block font-medium marker:text-sm mb-1.5 text-stone-800"
			for="contactPersonForStudents">{$_('user-pages.portraits.contactPersonStudents')}</label
		>
		<div class=" grid grid-cols-3 gap-x-2" id="contactPersonForStudents">
			<Input placeholder={$_('user-pages.portraits.name')} />
			<Input placeholder={$_('user-pages.portraits.phoneNumber')} />
			<Input placeholder={$_('user-pages.portraits.emailAddress')} />
		</div>
	</div>
	<div>
		<label
			class="block font-medium marker:text-sm mb-1.5 text-stone-800"
			for="contactPersonForGraduates">{$_('user-pages.portraits.contactPerson')}</label
		>
		<div class=" grid grid-cols-3 gap-x-2" id="contactPersonForGraduates">
			<Input placeholder={$_('user-pages.portraits.name')} />
			<Input placeholder={$_('user-pages.portraits.phoneNumber')} />
			<Input placeholder={$_('user-pages.portraits.emailAddress')} />
		</div>
	</div>

	<Input label={$_('user-pages.portraits.miscellaneous')} />
	<footer class=" mt-10 flex justify-between items-center mb-4">
		<p class=" text-sm text-stone-500">{$_('user-pages.portraits.lastEdited')}: 27 Dec 2023</p>
		<div class=" flex items-center">
			<Button
				classes="mr-2"
				onClick={() => {
					isOpen = false;
				}}
				>{$_('common.cancel')}
			</Button>
			<GradientButton onClick={() => (currentStep = 2)}>{$_('common.save')}</GradientButton>
		</div>
	</footer>
</div>
