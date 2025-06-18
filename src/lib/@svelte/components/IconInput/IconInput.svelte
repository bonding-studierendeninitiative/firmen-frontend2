<script lang="ts">
	import { ErrorMessage } from '../ErrorMessage';
	import { cn } from '@/utils/tailwind';

	type HandleInputType = undefined | { (e: any): void };

	interface Props {
		required?: boolean;
		placeholder?: string;
		label?: string;
		type?: 'number' | 'text' | 'email' | 'password';
		errorMessage?: string;
		classes?: string;
		iconType?: '' | 'startIcon' | 'endIcon';
		value?: string;
		handleInput?: HandleInputType;
		ref?: any;
		name?: string;
		icon_start?: import('svelte').Snippet;
		icon?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		required = false,
		placeholder = '',
		label = '',
		type = 'text',
		errorMessage = '',
		classes = '',
		iconType = '',
		value = $bindable(''),
		handleInput = undefined,
		ref = $bindable(null),
		name = '',
		icon_start,
		icon,
		...rest
	}: Props = $props();
</script>

<div class={cn('flex-grow', rest.disabled && 'opacity-50')}>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</label>
	{/if}
	<div class=" w-full">
		<div class="relative">
			{#if iconType === 'startIcon'}
				<div
					class="absolute inset-y-0 z-10 start-0 my-2 flex items-center ps-3 pointer-events-none text-slate-400 border-r border-slate-200 w-20"
				>
					{@render icon_start?.()}
				</div>
			{:else}
				<div
					class="absolute inset-y-0 z-50 end-0 flex items-center pe-3 pointer-events-none text-slate-400"
				>
					{@render icon?.()}
				</div>
			{/if}

			<input
				id={label}
				{name}
				{placeholder}
				{type}
				{value}
				{required}
				bind:this={ref}
				oninput={(e) => {
					// @ts-expect-error as value will always be present on input element
					value = e?.target?.value;
					handleInput?.(e);
				}}
				class={cn(
					'rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-none  text-stone-800 text-sm font-normal ',
					classes
				)}
				{...rest}
			/>
		</div>
		<ErrorMessage message={errorMessage} />
	</div>
</div>
