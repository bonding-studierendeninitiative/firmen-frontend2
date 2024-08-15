<script lang="ts">
	import { SearchIcon } from '$lib/@svelte/icons';
	import { Input } from '@/components/ui/input';
	export let placeholder: string = '';
	export let value: string = '';
</script>

<div class=" max-w-[246px] w-full">
	<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
	<div class="relative">
		<Input {placeholder} bind:value />
		<div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
			<SearchIcon />
		</div>
	</div>
</div>
