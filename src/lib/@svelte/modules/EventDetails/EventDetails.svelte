<script lang="ts">
	import { Datepicker, Drawer, Input, Select, Badge } from '$lib/@svelte/components';

	export let isOpen: boolean = false;

	const packages = ['Light', 'Standard', 'Premium'];
	const addons = ['Onlinewerbung-Paket', 'Printwerbung-Paket', 'Bonding-Tüte', 'Sonstiges'];
</script>

<Drawer
	bind:isOpen
	heading="Event Details"
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<div class="grid grid-cols-1 gap-4 w-full max-h-[690px] overflow-y-scroll">
		<Input label="Event Name" />
		<div class="grid grid-cols-2 gap-4 w-full">
			<Select label="City" />
			<Input label="Street & Number" />
		</div>
		<Input label="Name of University" />
		<div class="grid grid-cols-2 gap-4 w-full">
			<Datepicker label="Start Date" />
			<Datepicker label="End Date" />
		</div>
		<div class="grid grid-cols-2 gap-4 w-full mt-0">
			<Datepicker label="Time Start" type="time" />
			<Datepicker label="Time End" type="time" />
		</div>
		<Select label="Specialties" />
		<Select label="Event template (optional)" />
		<Select label="City" />
		<Select label="Packages" />
		<div class=" flex items-center flex-wrap gap-1">
			{#each packages as pkg (pkg)}
				<Badge isClearable>{pkg}</Badge>
			{/each}
		</div>
		<Select label="Addons" />
		<div class=" flex items-center flex-wrap gap-1">
			{#each addons as addon (addon)}
				<div class=" mr-2">
					<Badge isClearable>{addon}</Badge>
				</div>
			{/each}
		</div>
	</div>
</Drawer>
