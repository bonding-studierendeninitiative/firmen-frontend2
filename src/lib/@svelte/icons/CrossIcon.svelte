<script lang="ts">
	import { cn } from '@/utils/ui';
	interface Props {
		classes?: string;
		strokeWidth?: string;
	}

	let { classes = '', strokeWidth = '1.5' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width={strokeWidth}
	stroke="currentColor"
	class={cn('size-6 ', classes)}
>
	<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
