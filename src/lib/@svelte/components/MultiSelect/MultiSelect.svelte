<script lang="ts">
	import { Label, Helper, MultiSelect } from 'flowbite-svelte';


	interface Props {
		errorMessage?: string;
		label?: string;
		name?: string;
		value?: any;
		required?: boolean;
		items?: {
		value: string;
		name: string;
	}[];
		handleInput?: (e: any) => void;
		[key: string]: any
	}

	let {
		errorMessage = '',
		label = '',
		name = '',
		value = $bindable(null),
		required = false,
		items = [
		{ value: 'one', name: 'One' },
		{ value: 'two', name: 'Two' },
		{ value: 'three', name: 'Three' }
	],
		handleInput = () => {},
		...rest
	}: Props = $props();
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
		{...rest}
	/>
	<Helper class="text-red-500">{errorMessage}</Helper>
</div>
