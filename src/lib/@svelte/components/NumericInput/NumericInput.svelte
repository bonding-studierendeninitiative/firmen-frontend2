<script lang="ts">
	import { NumberInput, Helper, Label } from 'flowbite-svelte';
	import { clsx } from 'clsx';
	import { cn } from '@/utils';

	export let placeholder = '';
	export let ref: any = null;
	export let value: number = 0;
	export let name: string = '';
	export let errorMessage: string = '';
	export let label: string = '';
	export let required: boolean = false;
	export let hintText: string = '';

</script>

<div>
	{#if label}
		<Label class="block mb-1.5 font-medium text-stone-800" for={name}>{label}
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
			{...$$restProps}
			{placeholder}
			bind:value
			{name}
			{required}
			{...$$restProps}
			bind:this={ref}
			class={cn('rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-brand text-stone-800 text-sm font-normal ', $$props.class)}
		/>
		<Helper color="red">{errorMessage}</Helper>
	</div>
</div>
