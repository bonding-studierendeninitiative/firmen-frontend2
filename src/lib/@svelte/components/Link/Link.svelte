<script lang="ts">
	import { cn } from '@/utils';

	export let href: HTMLAnchorElement['href'];
</script>

<a {href} class={cn(' text-brand no-underline font-normal text-sm ', $$restProps.class)}>
	<slot />
</a>
