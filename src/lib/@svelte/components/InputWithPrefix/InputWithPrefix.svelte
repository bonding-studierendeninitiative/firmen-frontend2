<script lang="ts">
	import Input from '../Input/Input.svelte';
	export let prefixText: string = '';
	export let placeholder: string = '';
	export let pl: string = '24';
</script>

<div class="relative">
	<div
		class="absolute inset-y-0 start-0 my-2 flex items-center pointer-events-none text-slate-400 border-r border-slate-200 w-20"
	>
		<div
			class=" h-[37px] border border-solid border-gray-300 flex justify-center items-center rounded-l-lg p-4 text-stone-400 bg-stone-50"
		>
			{prefixText}
		</div>
	</div>
	<Input {placeholder} classes={`!pl-${pl}`} />
</div>
