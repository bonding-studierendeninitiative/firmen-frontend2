<script lang="ts">
	import { _ } from '@services';
	import { Drawer, Input, Select, Badge, Button } from '$lib/@svelte/components';
	import Checkbox from '$lib/@svelte/components/Checkbox/Checkbox.svelte';
	import GradientButton from '$lib/@svelte/components/GradientButton/GradientButton.svelte';
	import IconInput from '$lib/@svelte/components/IconInput/IconInput.svelte';
	import Textarea from '$lib/@svelte/components/Textarea/Textarea.svelte';
	import { CloudUploadIcon, DropzoneIcon } from '$lib/@svelte/icons';
	import Dropzone from 'svelte-file-dropzone';
	import toast from 'svelte-french-toast';

	export let isOpen: boolean = false;
	export let showListings: boolean;

	const disciplines = [
		'Bauingenieurwesen',
		'Elektrotechnik',
		'Informatik',
		'Kommunikationswissenschaften',
		'Maschinenbau',
		'Technische Informatik'
	];

	let currentStep = 1;
	let files: any = {
		accepted: [],
		rejected: []
	};

	$: isOpen, (currentStep = 1);

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}
	const handleSavePortrait = () => {
		toast.success($_('user-pages.portraits.portraitAddedSuccessMessage'));
		isOpen = false;
		showListings = true;
	};
</script>

<Drawer
	bind:isOpen
	heading={$_('user-pages.portraits.portrait')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	{#if currentStep === 1}
		<div class="grid grid-cols-1 gap-y-4 w-full">
			<Input label={$_('user-pages.portraits.nameOfPortrait')} />
			<Input label={$_('user-pages.portraits.comments')} />
			<Select
				label={$_('user-pages.portraits.branch')}
				placeholder={$_('user-pages.portraits.selectAnyBranch')}
			/>
			<Input label={$_('user-pages.portraits.company')} />
			<Input label={$_('user-pages.portraits.companyOrganizationChart')} />
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
			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>{$_('user-pages.portraits.internships')}</label
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
			<hr class=" border border-stone-200 my-2" />
			<div class=" grid grid-cols-1 gap-2">
				<Input
					label={$_('user-pages.portraits.contactAddress')}
					placeholder={$_('user-pages.portraits.companyAddress')}
				/>
				<Input placeholder={$_('user-pages.portraits.branch')} />
				<div class=" grid grid-cols-2 gap-x-2">
					<Input placeholder={$_('user-pages.portraits.city')} />
					<Input placeholder={$_('user-pages.portraits.zipCode')} />
				</div>
			</div>
			<div class=" grid grid-cols-1 gap-2">
				<Input
					label={$_('user-pages.portraits.contactPerson')}
					placeholder={$_('user-pages.portraits.name')}
				/>
				<Input placeholder={$_('user-pages.portraits.phoneNumber')} />
				<Input placeholder={$_('user-pages.portraits.emailAddress')} />
				<Input placeholder={$_('user-pages.portraits.website')} />
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
	{:else}
		<div class="w-full h-full flex flex-col justify-between">
			<div>
				<div>
					<label class="block mb-3 font-medium marker:text-sm text-stone-800" for="Locations"
						>{$_('user-pages.portraits.uploadPDF')}</label
					>
					<Dropzone
						disableDefaultStyles
						containerClasses=" border border-dashed border-gray-300 py-4 bg-gray-50"
						on:drop={handleFilesSelect}
					>
						<div class="  flex justify-center items-center flex-col">
							<CloudUploadIcon />
							<p class="mt-5 text-sm text-gray-500 font-normal">
								<span class=" text-brand">{$_('user-pages.portraits.clickToUpload')}</span>
								{$_('user-pages.portraits.orDragAndDrop')}
							</p>
							<p class="text-gray-500 text-sm font-normal">
								{$_('user-pages.portraits.fileInstructions')}
							</p>
						</div></Dropzone
					>
				</div>
				<div class="w-full">
					<label class="block my-3 font-medium marker:text-sm text-stone-800" for="Locations"
						>{$_('user-pages.portraits.companyLogo')}</label
					>
					<div class=" flex">
						<img src="user.png" alt="User" />
						<div class=" flex flex-col ml-4">
							<div>
								<Button onClick={() => undefined} classes="mb-3 !py-1.5"
									>{$_('common.upload')}</Button
								>
							</div>
							<p class="text-gray-500 text-sm font-normal">
								{$_('user-pages.portraits.logoInstructions')}
							</p>
						</div>
					</div>
				</div>
			</div>
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
					<GradientButton onClick={handleSavePortrait}>{$_('common.save')}</GradientButton>
				</div>
			</footer>
		</div>
	{/if}
</Drawer>
