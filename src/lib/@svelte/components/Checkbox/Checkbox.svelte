<script lang="ts">
	import { type ClassValue } from 'clsx';
	import { cn } from '@/utils/tailwind';

	interface Props {
		checked?: boolean;
		label?: string;
		name?: string;
		containerClass?: ClassValue;
		labelClasses?: string;
		description?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		[key: string]: any
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
	}: Props = $props();
</script>

<div class={cn('grid gap-x-4 gap-y-2 grid-cols-[auto_1fr_1fr]', containerClass)}>
	<input
		bind:checked
		{...rest}
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
		{@render description?.()}
	</div>
	<div class="col-span-2 col-start-2">
		{@render children?.()}
	</div>
</div>
