<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		title?: string;
		description?: string;
		children?: any;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
		centered?: boolean;
		showBackgroundPattern?: boolean;
		class?: string;
	}

	let {
		title,
		description,
		children,
		maxWidth = 'md',
		centered = true,
		showBackgroundPattern = true,
		class: className
	}: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};
</script>

<div
	class={cn(
		'min-h-screen flex flex-col',
		centered ? 'items-center justify-center' : 'items-center',
		'p-4',
		className
	)}
>
	{#if showBackgroundPattern}
		<!-- Background gradient -->
		<div
			class="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
		></div>
	{/if}

	<div class={cn('w-full z-10', maxWidthClasses[maxWidth])}>
		{#if title || description}
			<div class="text-center mb-8">
				{#if title}
					<h1 class="text-2xl font-bold tracking-tight">{title}</h1>
				{/if}
				{#if description}
					<p class="text-muted-foreground mt-2">{description}</p>
				{/if}
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
