<script lang="ts">
	import { type ClassValue } from 'clsx';
	import { cn } from '@/utils/ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useId } from 'bits-ui';

	interface Props {
		checked?: boolean;
		label?: string;
		name?: string;
		containerClass?: ClassValue;
		labelClasses?: string;
		description?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let {
		checked = $bindable(false),
		label = '',
		name = '',
		containerClass = '',
		labelClasses = '',
		description,
		children,
		...rest
	}: Props & HTMLAttributes<HTMLInputElement> = $props();
	let id = useId();
</script>

<div class={cn('grid gap-x-4 gap-y-2 grid-cols-[auto_1fr_1fr]', containerClass)}>
	<input
		bind:checked
		{...rest}
		{id}
		{name}
		type="checkbox"
		class="size-4 text-brand bg-gray-100 border-gray-300 rounded cursor-pointer col-span-1"
	/>
	{#if label}
		<label
			for={id}
			class={cn(
				'text-sm font-medium text-stone-800 cursor-pointer justify-self-start col-span-2',
				labelClasses
			)}>{label}</label
		>
	{/if}
	<div class="col-span-2 col-start-2">
		{@render description?.()}
	</div>
	<div class="col-span-2 col-start-2">
		{@render children?.()}
	</div>
</div>
