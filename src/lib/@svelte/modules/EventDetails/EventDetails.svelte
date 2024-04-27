<script lang="ts">
	import { _ } from '@services';
	import { Datepicker, Drawer, Input, Select, Badge } from '$lib/@svelte/components';

	export let isOpen: boolean = false;

	const packages = ['light', 'standard', 'premium'];
	const addons = ['Onlinewerbung-Paket', 'Printwerbung-Paket', 'Bonding-Tüte', 'Sonstiges'];
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.events.eventDetails')}
	handleSubmit={() => {
		isOpen = false;
	}}
	hasActions={false}
>
	<div class="grid grid-cols-1 gap-4 w-full max-h-[690px] overflow-y-scroll">
		<Input label={$_('admin-pages.events.eventName')} />
		<div class="grid grid-cols-2 gap-4 w-full">
			<Select label={$_('common.city')} />
			<Input label={$_('admin-pages.events.street&Number')} />
		</div>
		<Input label={$_('admin-pages.events.nameOfUniversity')} />
		<div class="grid grid-cols-2 gap-4 w-full">
			<Datepicker label={$_('admin-pages.events.startDate')} />
			<Datepicker label={$_('admin-pages.events.endDate')} />
		</div>
		<div class="grid grid-cols-2 gap-4 w-full mt-0">
			<Datepicker label={$_('admin-pages.events.startTime')} type="time" />
			<Datepicker label={$_('admin-pages.events.endTime')} type="time" />
		</div>
		<Select label={$_('admin-pages.events.specialties')} />
		<Select label={$_('admin-pages.events.eventTemplate')} />
		<Select label={$_('common.packages')} />
		<div class=" flex items-center flex-wrap gap-1">
			{#each packages as pkg (pkg)}
				<Badge isClearable>{$_(`common.${pkg}`)}</Badge>
			{/each}
		</div>
		<Select label={$_('common.addons')} />
		<div class=" flex items-center flex-wrap gap-1">
			{#each addons as addon (addon)}
				<div class=" mr-2">
					<Badge isClearable>{addon}</Badge>
				</div>
			{/each}
		</div>
	</div>
</Drawer>
