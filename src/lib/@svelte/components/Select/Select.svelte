<script lang="ts">
	import { SelectDown, SelectUp } from '$lib';
	import Select from 'svelte-select';

	export let placeholder: string = '';

	let items = [
		{ value: 'one', label: 'One' },
		{ value: 'two', label: 'Two' },
		{ value: 'three', label: 'Three' }
	];
	let listOpen = false;
</script>

<Select {items} showChevron bind:listOpen {placeholder}>
	<div slot="chevron-icon" class=" text-stone-400">
		{#if listOpen}
			<SelectUp />
		{:else}
			<SelectDown />
		{/if}
	</div>
</Select>
