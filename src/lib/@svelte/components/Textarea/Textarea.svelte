<script lang="ts">
	import { Textarea, Helper, Label } from 'flowbite-svelte';

	type HandleInputType = undefined | { (e: any): void };

	export let placeholder = '';
	export let required = false;
	export let classes = '';
	export let value: string = '';
	export let ref: any = null;
	export let handleInput: HandleInputType = undefined;
	export let errorMessage: string = '';
	export let label: string = '';
	export let name: string = '';
</script>

<div>
	{#if label}
		<Label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</Label>
	{/if}
	<Textarea
		bind:this={ref}
		bind:value
		class={'rounded-lg w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-none focus:ring focus:border-blue-500 text-stone-800 text-sm font-normal '.concat(
			classes
		)}
		id={label}
		{name}
		on:input={(e) => {
			// @ts-expect-error as value will always be present on input element
			value = e?.target?.value;
			handleInput?.(e);
		}}
		{placeholder}
		{required}
		rows={6}
	/>
	<Helper color="red">{errorMessage}</Helper>
</div>
