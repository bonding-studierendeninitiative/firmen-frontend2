<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from "bits-ui-old";
	import { slide } from "svelte/transition";

	type $$Props = CollapsiblePrimitive.ContentProps;

	let { transition = slide, transitionConfig = {
		duration: 150,
	}, children, ...rest }: $$Props = $props();
</script>

<CollapsiblePrimitive.Content {transition} {transitionConfig} {...rest}>
	{@render children?.()}
</CollapsiblePrimitive.Content>
