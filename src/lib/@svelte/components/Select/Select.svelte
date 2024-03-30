<script lang="ts">
	import { SelectDown, SelectUp } from '$lib/@svelte/icons';
	import Select from 'svelte-select';

	export let placeholder: string = '';
	export let label: string = '';

	let items = [
		{ value: 'one', label: 'One' },
		{ value: 'two', label: 'Two' },
		{ value: 'three', label: 'Three' }
	];
	let listOpen = false;
</script>

<div>
	{#if label}
		<label class=" block mb-1 font-medium marker:text-sm text-stone-800" for={label}>{label}</label>
	{/if}
	<Select
		{items}
		showChevron
		bind:listOpen
		{placeholder}
		containerStyles="box-shadow: 0px 1.5px 4px -1px rgba(0, 0, 0, 0.08); height:20px !important;"
		--height="38px"
	>
		<div slot="chevron-icon" class=" text-stone-400">
			{#if listOpen}
				<SelectUp />
			{:else}
				<SelectDown />
			{/if}
		</div>
	</Select>
</div>
