<script lang="ts">
	import Input from '../Input/Input.svelte';
	export let prefixText: string = '';
	export let placeholder: string = '';
</script>

<div class=" flex max-h-[40px]">
	<div
		class=" border border-solid border-gray-300 shadow-md flex justify-center items-center rounded-l-lg p-4 text-stone-400 bg-stone-50"
	>
		{prefixText}
	</div>
	<Input classes=" !rounded-l-none  !border-l-0" {placeholder} />
</div>
