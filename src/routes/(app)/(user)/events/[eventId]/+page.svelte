<script lang="ts">
	import { GradientButton, Button } from '$lib/@svelte/components';
	import Checkbox from '$lib/@svelte/components/Checkbox/Checkbox.svelte';
	import Chip from '$lib/@svelte/components/Chip/Chip.svelte';
	import {
		OutlinedCheckIcon,
		OutlinedCrossIcon,
		CalenderIcon,
		LocationIcon
	} from '$lib/@svelte/icons';

	export let heading = 'Tech Foundation 2024';
	export let mainDate = 'Freitag, 17 März, 2024';
	export let mainLocation = 'Lanxess Arena';

	const packageDetails: any = [
		{
			feature:
				'4m×2m Messestand mit Mobiliar Internetzugang Portrait in Katalog & Website Verpflegung am Stand warmes Mittagsbuffet Einladung zu der Abendveranstaltung',
			light: true,
			standard: true,
			premium: true
		},
		{ feature: 'Imageanzeige im Katalog', light: true, standard: true, premium: true },
		{ feature: 'Credits für bonding Jobwall.de*', light: false, standard: false, premium: true },
		{
			feature: 'Unternehmenslogoplatzierung auf der Website der RWTH**',
			light: true,
			standard: false,
			premium: true
		},
		{ feature: 'Logo auf Banner im Studicafé', light: true, standard: true, premium: true },
		{
			feature: 'SocialMedia-Post nach Ihrer Gestal- tung',
			light: false,
			standard: true,
			premium: true
		},
		{
			feature: 'Logo auf Großflächenplakaten (Campus/Stadt)',
			light: false,
			standard: true,
			premium: true
		},
		{
			feature: 'Direktmailing an 3 Studiengänge der Dean‘s List***',
			light: false,
			standard: true,
			premium: true
		}
	];
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
</script>

<div>
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{heading}</h4>
				<div class=" flex mt-2">
					<span class=" flex items-center mr-2">
						<!-- svelte-ignore missing-declaration -->
						<CalenderIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{mainDate}</p>
					</span>
					<span class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{mainLocation}</p>
					</span>
				</div>
			</div>
		</div>
		<div>
			<GradientButton onClick={() => undefined}>Register Now</GradientButton>
		</div>
	</div>
	<div class=" my-10">
		<hr />
	</div>
	<section>
		<h4 class=" font-extrabold text-sm text-stone-900">Overview</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
			eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
			consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
			aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
			incididunt ut labore et dolore magna aliqua
		</p>
	</section>
	<div class=" my-10 grid grid-cols-2 gap-5 h-[280px] w-full">
		<img alt="event" class=" object-fill rounded-lg h-full" src="/event1.png" />
		<div class=" grid grid-cols-1 grid-rows-2 gap-3">
			<img alt="event" class="object-fill rounded-lg h-full" src="/event2.png" />
			<img alt="event" class="object-fill rounded-lg h-full" src="/event3.png" />
		</div>
	</div>
	<section class=" my-10">
		<h4 class=" font-extrabold text-sm text-stone-900">Packages</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		</p>
		<table class=" w-full mt-6 rounded-lg">
			<thead>
				<tr>
					<th class=" w-2/5"></th>
					<th class=" w-1/5 p-3">
						<div>
							<p class=" text-brand text-sm font-medium">Light</p>
							<p class=" font-extrabold text-2xl mt-2">2.500,00€</p>
						</div>
					</th>
					<th class=" w-1/5 p-3">
						<div>
							<p class=" text-brand text-sm font-medium">Standard</p>
							<p class=" font-extrabold text-2xl mt-2">3.200,00€</p>
						</div>
					</th>
					<th class=" w-1/5 p-3">
						<div>
							<p class=" text-brand text-sm font-medium">Premium</p>
							<p class=" font-extrabold text-2xl mt-2">5.700,00€</p>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each packageDetails as pkg (pkg)}
					<tr>
						<td class="  p-3 border border-stone-200 text-sm">{pkg.feature}</td>
						<td class=" p-3 border border-stone-200">
							<div class="flex justify-center items-center">
								{#if pkg.light}
									<OutlinedCheckIcon />
								{:else}
									<OutlinedCrossIcon />
								{/if}
							</div>
						</td>
						<td class="  p-3 border border-stone-200">
							<div class="flex justify-center items-center">
								{#if pkg.standard}
									<OutlinedCheckIcon />
								{:else}
									<OutlinedCrossIcon />
								{/if}
							</div>
						</td>
						<td class=" p-3 border border-stone-200">
							<div class="flex justify-center items-center">
								{#if pkg.premium}
									<OutlinedCheckIcon />
								{:else}
									<OutlinedCrossIcon />
								{/if}
							</div>
						</td>
					</tr>
				{/each}
				<tr>
					<td></td>
					<td class=" p-3">
						<div class=" flex justify-center items-center">
							<GradientButton onClick={() => undefined} classes="!py-1.5 !px-4"
								>Selected</GradientButton
							>
						</div>
					</td>
					<td class=" p-3">
						<div class=" flex justify-center items-center">
							<Button onClick={() => undefined} classes="!py-1.5 !px-4">Select</Button>
						</div>
					</td>
					<td class=" p-3">
						<div class=" flex justify-center items-center">
							<Button onClick={() => undefined} classes="!py-1.5 !px-4">Select</Button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</section>
	<section>
		<h4 class=" font-extrabold text-sm text-stone-900">Additional Marketing Services</h4>
		<p class=" mt-2 text-stone-500 font-normal text-sm">
			(Alle Preise verstehen sich zuzüglich der jeweils gültigen gesetzlichen Umsatzsteuer) - Bitte
			beachten Sie, dass aus Gründen der Exklusivität und der limitierten Druckflächen nur eine
			begrenzte Anzahl von Firmenlogos abgedruckt werden kann. Zudem behält sich der Veranstalter
			vor, Werbemittel bei zu geringem Interesse oder aus Gründen nicht gegebener Umsetzbarkeit
			auszusetzen.
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
	<footer class=" flex mt-6 justify-end items-center">
		<GradientButton onClick={() => undefined}>Continue</GradientButton>
	</footer>
</div>
