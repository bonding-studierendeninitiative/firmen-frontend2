<script lang="ts">
	import { type ClassValue, clsx } from 'clsx';
	import { cn } from '@/utils/tailwind';

	export let checked: boolean = false;
	export let label: string = '';
	export let name: string = '';
	export let containerClass: ClassValue = '';
	export let labelClasses: string = '';
</script>

<div class={cn('grid gap-x-4 gap-y-2 grid-cols-[auto_1fr_1fr]', containerClass)}>
	<input
		bind:checked
		{...$$restProps}
		id={name}
		{name}
		type="checkbox"
		class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded cursor-pointer col-span-1"
	/>
	{#if label}
		<label
			for={name}
			class={cn(
				'text-sm font-medium text-stone-800 cursor-pointer justify-self-start col-span-2',
				labelClasses
			)}>{label}</label
		>
	{/if}
	<div class="col-span-2 col-start-2">
		<slot name="description" />
	</div>
	<div class="col-span-2 col-start-2">
		<slot />
	</div>
</div>
