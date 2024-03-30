<script lang="ts">
	import Input from '../Input/Input.svelte';
	export let placeholder: string = '';
	export let label: string = '';
</script>

<div>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={label}>{label}</label
		>
	{/if}
	<div class=" max-w-[246px] w-full">
		<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label
		>
		<div class="relative">
			<Input {placeholder} />
			<div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
				<slot name="icon" />
			</div>
		</div>
	</div>
</div>
