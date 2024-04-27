<script lang="ts">
	import { _ } from '@services';
	import { Button } from '$lib/@svelte/components';

	export let portraitsInfo = [
		{ name: 'Portrait Document #1', branch: 'Engineering' },
		{ name: 'Portrait Document #2', branch: 'Telecommunications' }
	];
</script>

<section>
	{#each portraitsInfo as { name, branch } (name)}
		<div class=" flex justify-between items-center mb-6">
			<div class=" flex">
				<div
					class={`rounded-lg bg-brand text-white font-extrabold inline-flex justify-center items-center  w-12 h-12`}
				>
					PDF
				</div>
				<div class=" flex flex-col ml-4">
					<h3 class=" text-sm font-medium text-stone-800">{name}</h3>
					<h4 class=" text-sm font-medium text-stone-500">{$_('common.branch')} - {branch}</h4>
				</div>
			</div>
			<Button onClick={() => undefined} classes=" inline shadow-custom !py-1"
				>{$_('common.download')}</Button
			>
		</div>
	{/each}
</section>
