<script lang="ts">
	import { ErrorMessage } from '../ErrorMessage';
	import { clsx } from 'clsx';
	import { cn } from '@/utils';

	type HandleInputType = undefined | { (e: any): void };
	export let required: boolean = false;
	export let placeholder: string = '';
	export let label: string = '';
	export let type: 'number' | 'text' | 'email' | 'password' = 'text';
	export let errorMessage: string = '';
	export let classes = '';
	export let iconType: '' | 'startIcon' | 'endIcon' = '';
	export let value = '';
	export let handleInput: HandleInputType = undefined;
	export let ref: any = null;

	export let name: string = '';
</script>

<div class={cn('flex-grow', $$restProps.disabled && 'opacity-50')}>
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
					<slot name="icon-start" />
				</div>
			{:else}
				<div
					class="absolute inset-y-0 z-50 end-0 flex items-center pe-3 pointer-events-none text-slate-400"
				>
					<slot name="icon" />
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
				on:input={(e) => {
					// @ts-expect-error as value will always be present on input element
					value = e?.target?.value;
					handleInput?.(e);
				}}
				class={cn(
					'rounded-lg overflow-visible w-full border border-solid border-gray-300 bg-white shadow-custom flex p-2 pl-3 items-center gap-2 focus:outline-none  text-stone-800 text-sm font-normal ',
					classes
				)}
				{...$$restProps}
			/>
		</div>
		<ErrorMessage message={errorMessage} />
	</div>
</div>
