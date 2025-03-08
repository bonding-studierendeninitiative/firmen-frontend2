<script lang="ts">
	import {Input } from "@/components/ui/input";


	export let prefixText: string = '';
	export let name: string = '';
	export let required: boolean = false;
	export let value: string = '';
</script>

<div class="relative">
	<div class="absolute inset-y-0 left-0 flex items-center">
		<span class="flex h-full items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
			{prefixText}
		</span>
	</div>

	<Input {name} {required} bind:value class="pl-20" />
</div>
