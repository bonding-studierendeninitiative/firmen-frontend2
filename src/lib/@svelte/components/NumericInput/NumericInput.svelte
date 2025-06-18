<script lang="ts">
	import { NumberInput, Helper, Label } from 'flowbite-svelte';
	import { clsx } from 'clsx';
	import { cn } from '@/utils/tailwind';

	interface Props {
		placeholder?: string;
		ref?: any;
		value?: number;
		name?: string;
		errorMessage?: string;
		label?: string;
		required?: boolean;
		hintText?: string;
		class?: string;
		[key: string]: any
	}

	let {
		placeholder = '',
		ref = $bindable(null),
		value = $bindable(0),
		name = '',
		errorMessage = '',
		label = '',
		required = false,
		hintText = '',
		class: className = '',
		...rest
	}: Props = $props();
	
</script>

<div>
	{#if label}
		<Label class="block mb-1.5 font-medium text-stone-800" for={name}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</Label>
	{/if}
	{#if hintText}
		<Helper class="mb-2" color="gray">{hintText}</Helper>
	{/if}
	<div class="relative">
		<NumberInput
			id={name}
			{...rest}
			{placeholder}
			bind:value
			{name}
			{required}
			{...rest}
			bind:this={ref}
			class={cn(
				'rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-brand text-stone-800 text-sm font-normal ',
				className
			)}
		/>
		<Helper color="red">{errorMessage}</Helper>
	</div>
</div>
