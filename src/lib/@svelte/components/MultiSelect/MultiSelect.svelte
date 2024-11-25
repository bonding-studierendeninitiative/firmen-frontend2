<script lang="ts">
	import { Label, Helper, MultiSelect } from 'flowbite-svelte';

	export let errorMessage: string = '';
	export let label: string = '';
	export let name: string = '';
	export let value: any = null;
	export let required: boolean = false;

	export let items: {
		value: string;
		name: string;
	}[] = [
		{ value: 'one', name: 'One' },
		{ value: 'two', name: 'Two' },
		{ value: 'three', name: 'Three' }
	];
	export let handleInput: (e: any) => void = () => {};
</script>

<div class=" w-full">
	{#if label}
		<Label class="block mb-1 font-medium text-stone-800" for={name}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</Label>
	{/if}
	<MultiSelect
		on:select={handleInput}
		{items}
		id={name}
		{name}
		bind:value
		{required}
		class=" placeholder-red-800"
		{...$$restProps}
	/>
	<Helper class="text-red-500">{errorMessage}</Helper>
</div>
