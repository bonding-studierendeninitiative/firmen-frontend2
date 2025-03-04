<script lang="ts">
	import { cn } from '@/utils';

	let { url, title, class: clazz, ...restProps } = $props();
</script>

<embed
	src={url}
	width="100%" class={cn("[aspect-ratio:1/_1.41]", clazz)} {title} {...restProps} />