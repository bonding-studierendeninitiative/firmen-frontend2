<script lang="ts">
	import CrossEyeIcon from '$lib/@svelte/icons/CrossEyeIcon.svelte';
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	import EyeIcon from '$lib/@svelte/icons/EyeIcon.svelte';
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
	let showPassword = false;
	let isToggled = false;
</script>

<div>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}>{label}</label
		>
	{/if}
	<div class="relative">
		<input
			id={label}
			{placeholder}
			{type}
			{value}
			bind:this={ref}
			on:input={(e) => {
				// @ts-ignore as value will always be present on input element
				value = e?.target?.value;
				handleInput?.(e);
			}}
			class={'rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-none  text-stone-800 text-sm font-normal '.concat(
				classes
			)}
		/>
		{#if type === 'password' || isToggled}
			<div class="absolute inset-y-0 end-0 z-10 flex items-center pe-3 text-slate-400">
				{#if showPassword}
					<button
						on:click={() => {
							showPassword = false;
							type = 'password';
							isToggled = true;
						}}><CrossEyeIcon /></button
					>
				{:else}
					<button
						on:click={() => {
							showPassword = true;
							type = 'text';
							isToggled = true;
						}}><EyeIcon /></button
					>
				{/if}
			</div>
		{/if}
		<ErrorMessage message={errorMessage} />
	</div>
</div>
