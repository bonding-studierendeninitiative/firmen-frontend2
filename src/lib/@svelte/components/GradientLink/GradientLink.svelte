<script lang="ts">
	import { cn } from '@/utils/tailwind';

	interface Props {
		href: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { ...props }: Props = $props();
</script>

<a
	{...props}
	style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), #007EC7;"
	class={cn(
		'flex justify-center items-center relative px-4 py-2.5 space-x-4 rounded-lg text-white text-sm font-extrabold ',
		props.class
	)}
>
	<span>{@render props.children?.()}</span>
</a>
