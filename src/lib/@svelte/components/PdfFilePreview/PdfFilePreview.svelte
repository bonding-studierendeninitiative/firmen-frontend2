<script lang="ts">
	import { cn } from '@/utils';
	import type { HTMLEmbedAttributes } from 'svelte/elements';

	type Props = {
		url: string;
		title?: string;
		class?: string;
	} & HTMLEmbedAttributes;

	let { url, title = "", class: clazz = "", ...restProps }: Props = $props();
</script>

<embed
	src={url}
	width="100%" class={cn("[aspect-ratio:1/_1.41]", clazz)} {title} {...restProps} />