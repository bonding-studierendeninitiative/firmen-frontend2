<script lang="ts">
	import { ErrorMessage } from '../ErrorMessage';

	type HandleInputType = undefined | { (e: any): void };

	export let placeholder = '';
	export let classes = '';
	export let type: 'number' | 'text' | 'email' | 'password' = 'text';
	export let value: string = '';
	export let ref: any = null;
	export let handleInput: HandleInputType = undefined;
	export let errorMessage: string = '';
	export let label: string = '';
</script>

<div>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}>{label}</label
		>
	{/if}
	<textarea
		id={label}
		{placeholder}
		bind:this={ref}
		rows="6"
		on:input={(e) => {
			// @ts-ignore as value will always be present on input element
			value = e?.target?.value;
			handleInput?.(e);
		}}
		class={'rounded-lg w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-none focus:ring focus:border-blue-500 text-stone-800 text-sm font-normal '.concat(
			classes
		)}>{value}</textarea
	>
	<ErrorMessage message={errorMessage} />
</div>
