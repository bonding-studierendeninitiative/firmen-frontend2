<script lang="ts">
	import { GradientButton, Modal, Input, Select, Checkbox, Chip } from '$lib/@svelte/components';
	import Dropzone from 'svelte-file-dropzone';
	import { DropzoneIcon, CrossIcon, FilledCheckIcon } from '$lib/@svelte/icons';
	import { goto } from '$app/navigation';

	const marketingServices = [
		{
			name: 'Onlinewerbung-Paket',
			totalAmount: '1.105€',
			subServices: [
				{ name: 'Bonding-Infomails', amount: '100€' },
				{ name: 'Messewebsite', amount: '100€' },
				{ name: 'SocialMe.-Firmenvorstellung', amount: '100€' }
			]
		},
		{
			name: 'Printwerbung-Paket',
			totalAmount: '1.105€',
			subServices: [
				{ name: 'Flyer', amount: '100€' },
				{ name: 'Großflächenplakate', amount: '100€' },
				{ name: 'A0-Plakate', amount: '100€' },
				{ name: 'Exklusive CityLights', amount: '100€' }
			]
		},
		{
			name: 'Bonding-Tüte',
			totalAmount: '1.105€',
			subServices: [
				{ name: 'Logoplatzierung', amount: '100€' },
				{ name: 'Flyer -/ Postkarteneinlage', amount: '100€' },
				{ name: 'Exklusive Imageanzeige', amount: '100€' },
				{ name: 'Give-Away-Einlage', amount: '100€' }
			]
		},
		{
			name: 'Sonstiges',
			totalAmount: '1.105€',
			subServices: [
				{ name: 'Messezeltbanner', amount: '100€' },
				{ name: 'Coffee-To-Go-Becher', amount: '100€' },
				{ name: 'Exklusive Buswerbung', amount: '100€' }
			]
		}
	];

	let isOpen = false;

	let files: any = {
		accepted: [],
		rejected: []
	};

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	const handleFormSubmit = () => {
		isOpen = true;
	};
</script>

<Modal bind:isOpen>
	<div class=" flex flex-col justify-center items-center">
		<p class=" text-xl"><FilledCheckIcon /></p>
		<div class=" my-6 text-center">
			<h2 class=" text-stone-950 font-extrabold text-base">Registration Completed</h2>
			<p class="mt-2 text-stone-500 text-base">
				Thank you for registering for this event. Our team will verify your information and process
				your request. Once approved, you’ll receive a confirmation email.
			</p>
		</div>
	</div>
	<footer class=" flex items-center justify-center">
		<GradientButton classes="!py-1.5" onClick={() => goto('/events')}>View Events</GradientButton>
	</footer>
</Modal>
<div>
	<div class=" flex justify-between items-start">
		<h3 class=" text-xl font-extrabold text-stone-800">Registration Form</h3>
		<button><CrossIcon /></button>
	</div>
	<div class=" my-6">
		<hr />
	</div>

	<div class=" grid grid-cols-1 gap-4">
		<h4 class=" font-extrabold text-sm text-stone-900">Company Information</h4>
		<Input placeholder="Company Name" />
		<Input placeholder="Address" />
		<div class="grid grid-cols-2 gap-4">
			<Select placeholder="City" />
			<Select placeholder="State" />
		</div>
		<Input placeholder="Contact Person" />
		<Input placeholder="Number" />
		<Input placeholder="Email Address" />
	</div>

	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">Packages</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			Select one or multiple packages for the event registration. The payment shall be made once the
			information is verified and approved.
		</p>
		<div class=" border border-stone-200 w-full rounded-lg mt-6">
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label="Light Plan" labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label="Standard Plan" labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label="Premium Plan" labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
		</div>
	</section>
	<section>
		<h4 class=" font-extrabold text-sm text-stone-900">Addons</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			Select one or multiple packages for the event registration. The payment shall be made once the
			information is verified and approved.
		</p>
		<div class=" border border-stone-200 w-full rounded-lg mt-6">
			<div>
				<!-- marketingServices -->
				{#each marketingServices as marketingService (marketingService)}
					<div class=" border-b border-stone-200">
						<div class=" px-3 py-4 flex justify-between items-center">
							<div class=" flex items-center">
								<Checkbox label={marketingService.name} labelClasses=" !font-extrabold" />
								<Chip variant="brand" classes="ml-2" status="15%" />
							</div>
							<p class=" text-sm font-stone-800 font-extrabold">{marketingService.totalAmount}</p>
						</div>
						{#each marketingService.subServices as subService}
							<div class=" px-3 py-4 flex items-center justify-between ml-8">
								<Checkbox label={subService.name} />
								<p class=" text-sm font-stone-800 font-medium">{subService.amount}</p>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</section>
	<section class=" my-6">
		<Dropzone
			disableDefaultStyles
			containerClasses="border border-gray-300 py-4 bg-gray-50"
			on:drop={handleFilesSelect}
		>
			<div class=" flex justify-center items-center flex-col">
				<DropzoneIcon />
				<p class="mt-5 text-base text-opacity-85 text-black font-medium">
					Click or drag file to this area to upload
				</p>
				<p class="text-black text-sm text-opacity-45 font-normal">
					Support for a single or bulk upload.
				</p>
			</div></Dropzone
		>
	</section>
	<section class="my-6">
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-medium text-stone-800">Event Fee</p>
			<p class="text-sm font-extrabold text-stone-800">€400</p>
		</div>
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-medium text-stone-800">Total Addons</p>
			<p class="text-sm font-extrabold text-stone-800">€0</p>
		</div>
		<div class="flex items-center justify-between">
			<p class="text-sm font-medium text-stone-800">Taxes</p>
			<p class="text-sm font-extrabold text-stone-800">€0</p>
		</div>
		<div class=" my-4">
			<hr />
		</div>
		<div class="flex items-center justify-between mb-6">
			<p class="text-sm font-medium text-stone-800">Total</p>
			<p class="text-sm font-extrabold text-stone-800">€400</p>
		</div>
		<Checkbox label="I agree to Bonding privacy and policy" />
	</section>
	<footer class=" flex mt-6 justify-end items-center">
		<GradientButton onClick={handleFormSubmit}>Submit</GradientButton>
	</footer>
</div>
