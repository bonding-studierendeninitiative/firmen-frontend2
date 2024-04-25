<script lang="ts">
	import { Datepicker, Drawer, Input, Select, Badge, Button } from '$lib/@svelte/components';
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
		toast.success('Portrait added successfully');
		isOpen = false;
		showListings = true;
	};
</script>

<Drawer
	bind:isOpen
	heading="Portrait"
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	{#if currentStep === 1}
		<div class="grid grid-cols-1 gap-y-4 w-full">
			<Input label="Name of Portrait" />
			<Input label="Comments" />
			<Select label="Branch" placeholder="Select any branch" />
			<Input label="Company" />
			<Input label="Company Organization Chart" />
			<Textarea label="Products" />
			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>Locations</label
				>
				<div
					id="Locations"
					class=" grid grid-cols-3 gap-x-4 border border-stone-200 py-2 px-3 rounded-lg mb-2"
				>
					<div class=" border-r border-stone-200"><Checkbox label="All" /></div>
					<div class=" border-r border-stone-200"><Checkbox label="Inland" /></div>
					<div class=" border-r border-stone-200"><Checkbox label="International" /></div>
				</div>
				<Select placeholder="cities" />
			</div>
			<hr class=" border border-stone-200 my-2" />

			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>Sales volume</label
				>
				<div
					id="Locations"
					class=" grid grid-cols-3 gap-x-4 border border-stone-200 py-2 px-3 rounded-lg mb-2"
				>
					<div class=" border-r border-stone-200"><Checkbox label="All" /></div>
					<div class=" border-r border-stone-200"><Checkbox label="Inland" /></div>
					<div class=" border-r border-stone-200"><Checkbox label="International" /></div>
				</div>
				<Select placeholder="cities" />
			</div>
			<hr class=" border border-stone-200 my-2" />
			<IconInput label="Number of employees">
				<span slot="icon-start">Inland</span>
			</IconInput>
			<IconInput>
				<span slot="icon-start">EU</span>
			</IconInput>
			<IconInput>
				<span slot="icon-start">Global</span>
			</IconInput>
			<Input label="University graduates (optional)" />
			<Input label="Desired disciplines" />
			<div class=" flex items-center flex-wrap gap-1">
				{#each disciplines as discipline (discipline)}
					<div class=" mr-2">
						<Badge isClearable>{discipline}</Badge>
					</div>
				{/each}
			</div>
			<Textarea label="Entry opportunities" />
			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>Internships</label
				>
				<div
					id="Locations"
					class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
				>
					<div class=" border-r border-stone-200"><Checkbox label="Yes" labelClasses="py-2" /></div>
					<div><Checkbox label="No" labelClasses="py-2" /></div>
				</div>
			</div>
			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>Study/diploma theses
				</label>
				<div
					id="Locations"
					class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
				>
					<div class=" border-r border-stone-200"><Checkbox label="Yes" labelClasses="py-2" /></div>
					<div><Checkbox label="No" labelClasses="py-2" /></div>
				</div>
			</div>
			<div>
				<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for="Locations"
					>Foreign assignment</label
				>
				<div
					id="Locations"
					class=" grid grid-cols-2 gap-x-4 border border-stone-200 px-3 rounded-lg mb-2"
				>
					<div class=" border-r border-stone-200"><Checkbox label="Yes" labelClasses="py-2" /></div>
					<div><Checkbox label="No" labelClasses="py-2" /></div>
				</div>
			</div>
			<hr class=" border border-stone-200 my-2" />
			<div class=" grid grid-cols-1 gap-2">
				<Input label="Contact address" placeholder="Company Address" />
				<Input placeholder="Branch" />
				<div class=" grid grid-cols-2">
					<Input placeholder="City" />
					<Input placeholder="Zip Code" />
				</div>
			</div>
			<div class=" grid grid-cols-1 gap-2">
				<Input label="Contact person for graduates" placeholder="Name" />
				<Input placeholder="Phone Number" />
				<Input placeholder="Email Address" />
				<Input placeholder="Website" />
			</div>
			<Input label="Miscellaneous" />
			<footer class=" mt-10 flex justify-between items-center mb-4">
				<p class=" text-sm text-stone-500">Last Edited: 27 Dec 2023</p>
				<div class=" flex items-center">
					<Button
						classes="mr-2"
						onClick={() => {
							isOpen = false;
						}}
						>Cancel
					</Button>
					<GradientButton onClick={() => (currentStep = 2)}>Save</GradientButton>
				</div>
			</footer>
		</div>
	{:else}
		<div class="w-full h-full flex flex-col justify-between">
			<div>
				<div>
					<label class="block mb-3 font-medium marker:text-sm text-stone-800" for="Locations"
						>Upload PDF</label
					>
					<Dropzone
						disableDefaultStyles
						containerClasses=" border border-dashed border-gray-300 py-4 bg-gray-50"
						on:drop={handleFilesSelect}
					>
						<div class="  flex justify-center items-center flex-col">
							<CloudUploadIcon />
							<p class="mt-5 text-sm text-gray-500 font-normal">
								<span class=" text-brand">Click to upload</span> or drag and drop
							</p>
							<p class="text-gray-500 text-sm font-normal">SVG, PNG, JPG or GIF (max. 800x400px)</p>
						</div></Dropzone
					>
				</div>
				<div class="w-full">
					<label class="block my-3 font-medium marker:text-sm text-stone-800" for="Locations"
						>Company Logo</label
					>
					<div class=" flex">
						<img src="user.png" alt="User" />
						<div class=" flex flex-col ml-4">
							<div><Button onClick={() => undefined} classes="mb-3 !py-1.5">Upload</Button></div>
							<p class="text-gray-500 text-sm font-normal">
								Upload image under 5MB. PNG, JPEG, GIF. The images must be 500x500 pixels
							</p>
						</div>
					</div>
				</div>
			</div>
			<footer class=" mt-10 flex justify-between items-center mb-4">
				<p class=" text-sm text-stone-500">Last Edited: 27 Dec 2023</p>
				<div class=" flex items-center">
					<Button
						classes="mr-2"
						onClick={() => {
							isOpen = false;
						}}
						>Cancel
					</Button>
					<GradientButton onClick={handleSavePortrait}>Save</GradientButton>
				</div>
			</footer>
		</div>
	{/if}
</Drawer>
