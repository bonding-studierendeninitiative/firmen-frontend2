<script lang="ts">
	import { Drawer, Input, Select, Textarea } from '$lib/@svelte/components';
	export let isOpen: boolean = false;
</script>

<Drawer
	bind:isOpen
	heading="New Category"
	handleSubmit={() => {
		isOpen = false;
	}}
>
	<div class="grid grid-cols-1 gap-4 w-full">
		<Input label="Category Name" />
		<Textarea label="Category Information" />
		<Select placeholder="Select Packages" label="Packages" />
		<Select placeholder="Select Addons" label="Addons" />
	</div>
</Drawer>
