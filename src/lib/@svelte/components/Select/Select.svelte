<script lang="ts">
	import { Label, Helper, Select } from 'flowbite-svelte';
	import { cn } from '@/utils/tailwind';

	interface Props {
		errorMessage?: string;
		label?: string;
		name?: string;
		value?: any;
		required?: boolean;
		class?: string;
		items?: {
			value: string;
			name: string;
		}[];
		handleInput?: (e: any) => void;
		[key: string]: any;
	}

	let {
		errorMessage = '',
		label = '',
		name = '',
		value = $bindable(null),
		required = false,
		class: className = '',
		items = [
			{ value: 'one', name: 'One' },
			{ value: 'two', name: 'Two' },
			{ value: 'three', name: 'Three' }
		],
		handleInput = () => {},
		...rest
	}: Props = $props();
</script>

<div>
	{#if label}
		<Label class="block mb-1 font-medium text-stone-800" for={name}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</Label>
	{/if}
	<Select
		on:change={handleInput}
		{items}
		id={name}
		{name}
		bind:value
		{required}
		class={cn(`placeholder-red-800`, className)}
		{...rest}
	/>
	<Helper class="text-red-500">{errorMessage}</Helper>
</div>
