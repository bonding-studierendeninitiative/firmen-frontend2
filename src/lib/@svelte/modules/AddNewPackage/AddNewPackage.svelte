<script lang="ts">
	import { _ } from '@services';
	import { Drawer, IconInput, Input, Link, Select, Textarea } from '$lib/@svelte/components';
	import PlusIcon from '$lib/@svelte/icons/PlusIcon.svelte';
	import TrashIcon from '$lib/@svelte/icons/TrashIcon.svelte';
	export let isOpen: boolean = false;
	const service = { title: '', digit: '', included: '' };
	let services: { title: string; digit: string; included: string }[] = [];

	const handleAddService = () => {
		let servicesCopy = [...services];
		servicesCopy.push({ ...service });
		services = [...servicesCopy];
	};

	const handleRemoveService = (index: number) => {
		let servicesCopy = [...services];
		servicesCopy.splice(index, 1);
		services = [...servicesCopy];
	};
</script>

<Drawer
	bind:isOpen
	heading={$_('admin-pages.packages.newPackage')}
	handleSubmit={() => {
		isOpen = false;
	}}
>
	<div class="grid grid-cols-1 gap-4 w-full max-h-[590px] overflow-y-scroll">
		<Input label={$_('admin-pages.packages.packageName')} />
		<div class="grid grid-cols-2 gap-4 w-full">
			<IconInput label={$_('admin-pages.packages.price')} placeholder="0000">
				<span slot="icon" class=" text-stone-500">€</span>
			</IconInput>
			<Select label={$_('admin-pages.packages.taxes')} />
		</div>
		<div class="grid grid-cols-2 gap-4 w-full">
			<Textarea label={$_('admin-pages.packages.serviceTitle')} />
			<Select label={$_('admin-pages.packages.included')} />
		</div>
		<hr />
		<section>
			{#each services as service, index (service)}
				<div class={` relative grid grid-cols-2 gap-4 w-full  ${index !== 0 ? 'mt-2' : ''}`}>
					<button
						class="absolute right-0 top-0 text-red-400 text-xs"
						on:click={() => handleRemoveService(index)}><TrashIcon /></button
					>
					<Input label={$_('admin-pages.packages.serviceTitle')} classes="col-span-2" />
					<span class="flex items-center w-full col-span-1">
						<span class=" mr-2 w-2/5"><Select label={$_('admin-pages.packages.included')} /></span>
						<span class=" mr-2 w-3/5"><Input label={$_('admin-pages.packages.digit')} /></span>
					</span>
				</div>
			{/each}
		</section>
		<div id="addServiceButton">
			<Link classes=" flex items-center !font-semibold" onClick={handleAddService}
				><PlusIcon classes="mr-2" />{$_('admin-pages.packages.addNewService')}</Link
			>
		</div>
	</div>
</Drawer>
