<script lang="ts">
	import { ErrorMessage } from '../ErrorMessage';

	type HandleKeyDownType = undefined | { (e: any): void };
	type HandleInputType = undefined | { (e: any): void };

	export let placeholder = '';
	export let classes = '';
	export let type: 'number' | 'text' | 'email' | 'password' = 'text';
	export let value: string = '';
	export let ref: any = null;
	export let handleInput: HandleInputType = undefined;
	export let errorMessage: string = '';
</script>

<input
	{placeholder}
	{type}
	{value}
	bind:this={ref}
	on:input={(e) => {
		// @ts-ignore as value will always be present on input element
		value = e?.target?.value;
		handleInput?.(e);
	}}
	class={'rounded-lg w-full border border-solid border-gray-300 bg-white shadow-md flex p-2 pl-3 items-center gap-2 focus:outline-none focus:ring focus:border-blue-500 text-stone-800 text-sm font-normal '.concat(
		classes
	)}
/>
<ErrorMessage message={errorMessage} />
