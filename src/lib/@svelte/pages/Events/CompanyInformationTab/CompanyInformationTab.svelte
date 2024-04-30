<script lang="ts">
	import { _ } from '@services';
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

<div>
	<div class=" grid grid-cols-1 gap-4">
		<h4 class=" font-extrabold text-sm text-stone-900">
			{$_('user-pages.events.companyInformation')}
		</h4>
		<Input placeholder={$_('user-pages.events.companyName')} />
		<Input placeholder={$_('user-pages.events.address')} />
		<div class="grid grid-cols-2 gap-4">
			<Select placeholder={$_('user-pages.events.city')} />
			<Select placeholder={$_('user-pages.events.state')} />
		</div>
		<Input placeholder={$_('user-pages.events.contactPerson')} />
		<Input placeholder={$_('user-pages.events.number')} />
		<Input placeholder={$_('user-pages.events.emailAddress')} />
	</div>

	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('common.packages')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.packageDescription')}
		</p>
		<div class=" border border-stone-200 w-full rounded-lg mt-6">
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label={$_('common.lightPlan')} labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label={$_('common.standardPlan')} labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
			<div class=" px-3 py-4 flex justify-between items-center border-b border-stone-200">
				<Checkbox label={$_('common.premiumPlan')} labelClasses=" !font-extrabold" />
				<p class=" text-sm font-stone-800 font-extrabold">2.500,00€</p>
			</div>
		</div>
	</section>
	<section class=" pb-20">
		<h4 class=" font-extrabold text-sm text-stone-900">{$_('common.addons')}</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			{$_('user-pages.events.addonsDescription')}
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
</div>
