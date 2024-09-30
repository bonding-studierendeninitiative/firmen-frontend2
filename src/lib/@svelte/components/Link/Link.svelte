<script lang="ts">
	import { cn } from '@/utils';

	export let href: $$Props['href'] = '#';

	import { type Props, linkVariants } from "./index.js";

	type $$Props = Props;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export { className as class };
</script>

<a {href} class={cn(linkVariants({variant, className}))} {...$$restProps}>
	<slot />
</a>
