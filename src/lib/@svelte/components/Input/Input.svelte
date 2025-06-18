<script lang="ts">
	import CrossEyeIcon from '$lib/@svelte/icons/CrossEyeIcon.svelte';
	import EyeIcon from '$lib/@svelte/icons/EyeIcon.svelte';
	import { Input, Helper, Label } from 'flowbite-svelte';

	type HandleInputType = undefined | { (e: any): void };

	interface Props {
		placeholder?: string;
		classes?: string;
		type?: 'number' | 'text' | 'email' | 'password';
		value?: string;
		ref?: any;
		name?: string;
		handleInput?: HandleInputType;
		errorMessage?: string;
		label?: string;
		required?: boolean;
		hintText?: string;
		[key: string]: any
	}

	let {
		placeholder = '',
		classes = '',
		type = $bindable('text'),
		value = $bindable(''),
		ref = $bindable(null),
		name = '',
		handleInput = undefined,
		errorMessage = '',
		label = '',
		required = false,
		hintText = '',
		...rest
	}: Props = $props();

	let showPassword = $state(false);
	let isToggled = $state(false);
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
		<Input
			id={name}
			{...rest}
			{placeholder}
			{type}
			{value}
			{name}
			{required}
			bind:this={ref}
			on:input={(e) => {
				// @ts-expect-error as value will always be present on input element
				value = e?.target?.value;
				handleInput?.(e);
			}}
			class={'rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-brand text-stone-800 text-sm font-normal '.concat(
				classes
			)}
		/>
		{#if type === 'password' || isToggled}
			<div class="absolute inset-y-0 end-0 z-10 flex items-center pe-3 text-slate-400">
				{#if showPassword}
					<button
						onclick={() => {
							showPassword = false;
							type = 'password';
							isToggled = true;
						}}
					>
						<CrossEyeIcon />
					</button>
				{:else}
					<button
						onclick={() => {
							showPassword = true;
							type = 'text';
							isToggled = true;
						}}
					>
						<EyeIcon />
					</button>
				{/if}
			</div>
		{/if}
		<Helper color="red">{errorMessage}</Helper>
	</div>
</div>
