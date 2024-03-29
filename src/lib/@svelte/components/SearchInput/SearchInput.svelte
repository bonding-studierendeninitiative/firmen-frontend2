<script lang="ts">
	import { SearchIcon } from '$lib';
	import Input from '../Input/Input.svelte';
	export let placeholder: string = '';
</script>

<div class=" max-w-[246px] w-full">
	<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
	<div class="relative">
		<Input {placeholder} />
		<!-- <input
			type="text"
			id="default-search"
			class="block w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
			{placeholder}
			required
		/> -->
		<div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
			<SearchIcon />
		</div>
	</div>
</div>
