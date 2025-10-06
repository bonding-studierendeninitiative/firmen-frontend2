<script lang="ts">
	import { cn } from '@/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			container?: string;
		};
		children: Snippet;
	}

	let { className = '', classNames = {}, children }: Props = $props();
</script>

<div class={cn('flex min-h-screen items-center justify-center p-4', className, classNames?.base)}>
	<div class={cn('w-full max-w-sm space-y-6', classNames?.container)}>
		{@render children()}
	</div>
</div>
