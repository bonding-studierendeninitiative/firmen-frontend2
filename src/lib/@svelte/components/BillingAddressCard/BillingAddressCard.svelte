<script lang="ts">
	import { PencilSquareIcon } from '$lib/@svelte/icons';
	import { Button } from '..';
	import ButtonIcon from '../ButtonIcon/ButtonIcon.svelte';
	export let isDefault: boolean;
</script>

<div class=" bg-stone-50 p-4 w-full flex justify-between mt-2 rounded-lg">
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		<div class=" text-stone-800 text-sm font-normal">
			<p class=" m-0">Scharnweberstrasse 43, Wilhelmsfeld</p>
			<p class=" m-0">Baden-Württemberg, Germany</p>
			<p class=" m-0">69259</p>
		</div>
		<span class=" flex items-center justify-end">
			<!-- <GradientButton classes="px-6" onClick={() => undefined}>Details</GradientButton> -->
			{#if isDefault}
				<div class=" bg-stone-200 mx-6 text-slate-700 rounded-lg py-1.5 px-4">Default</div>
			{:else}
				<Button classes="mx-6" onClick={() => undefined}>Make it default</Button>
			{/if}
			<button class="text-stone-500"><PencilSquareIcon /></button>
		</span>
	</div>
</div>
