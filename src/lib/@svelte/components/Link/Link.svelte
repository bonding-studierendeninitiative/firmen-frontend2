<script lang="ts">
	import { cn } from '@/utils/tailwind';
	import { type Props, linkVariants } from './index.js';

	let {
		href = '#',
		class: className = undefined,
		variant = 'default',
		children,
		...rest
	}: Props = $props();
</script>

<a {href} class={cn(linkVariants({ variant, className }))} {...rest}>
	{@render children?.()}
</a>
