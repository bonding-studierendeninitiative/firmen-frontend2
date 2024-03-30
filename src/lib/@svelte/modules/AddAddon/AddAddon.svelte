<script lang="ts">
	import { Drawer, IconInput, Input, Link, Select, Textarea } from '$lib/@svelte/components';
	import PlusIcon from '$lib/@svelte/icons/PlusIcon.svelte';
	import TrashIcon from '$lib/@svelte/icons/TrashIcon.svelte';
	export let isOpen: boolean = false;
	const subAddon = { name: '', price: '' };
	let subAddons: { name: string; price: string }[] = [];
	const handleAddSubAddon = () => {
		let subAddonsCopy = [...subAddons];
		subAddonsCopy.push({ ...subAddon });
		subAddons = [...subAddonsCopy];
	};
	const handleRemoveAddon = (index: number) => {
		let subAddonsCopy = [...subAddons];
		subAddonsCopy.splice(index, 1);
		subAddons = [...subAddonsCopy];
	};
</script>

<Drawer
	bind:isOpen
	heading="New Addons"
	handleSubmit={() => {
		isOpen = false;
	}}
>
	<div class="grid grid-cols-1 gap-4 w-full max-h-[590px] overflow-y-scroll">
		<Input label="Addon Name" />
		<div class="grid grid-cols-2 gap-4 w-full">
			<IconInput label="Price" placeholder="0000">
				<span slot="icon" class=" text-stone-500">€</span>
			</IconInput>
			<IconInput label="Sale Tag">
				<span slot="icon" class=" text-stone-500">%</span>
			</IconInput>
		</div>
		<Textarea label="Package Information" />
		<hr />
		<section>
			{#each subAddons as subAddon, index (subAddon)}
				<div class={` relative grid grid-cols-2 gap-4 w-full  ${index !== 0 ? 'mt-2' : ''}`}>
					<button
						class="absolute right-0 top-0 text-red-400 text-xs"
						on:click={() => handleRemoveAddon(index)}><TrashIcon /></button
					>
					<Input label="Sub Add-on Name" />
					<IconInput label="Price">
						<span slot="icon" class=" text-stone-500">€</span>
					</IconInput>
				</div>
			{/each}
		</section>
		<div>
			<Link classes=" flex items-center !font-semibold" onClick={handleAddSubAddon}
				><PlusIcon classes="mr-2" />Add Sub Addon</Link
			>
		</div>
	</div>
</Drawer>
