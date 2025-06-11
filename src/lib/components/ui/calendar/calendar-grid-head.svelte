<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui-old";
	import { cn } from "@/utils";

	type $$Props = CalendarPrimitive.GridHeadProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<CalendarPrimitive.GridHead class={cn(className)} {...$$restProps}>
	<slot />
</CalendarPrimitive.GridHead>
