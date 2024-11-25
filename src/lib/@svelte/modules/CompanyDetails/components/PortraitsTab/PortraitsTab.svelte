<script lang="ts">
	import { _ } from '@services';
	import { Button } from '$lib/@svelte/components';
	import type { GetPortraitTemplatesResponse } from '@schema';
	import type { InferOutput } from 'valibot';

	export const portraitsInfo = [
		{ name: 'Portrait Document #1', branch: 'Engineering' },
		{ name: 'Portrait Document #2', branch: 'Telecommunications' }
	];

	export let portraitTemplates: InferOutput<GetPortraitTemplatesResponse>['portraitTemplates'];

	console.log({ portraitTemplates });
</script>

<section>
	{#each portraitTemplates as { title, displayName, id } (id)}
		<div class=" flex justify-between items-center mb-6">
			<div class=" flex">
				<div
					class={`rounded-lg bg-brand text-white font-extrabold inline-flex justify-center items-center  w-12 h-12`}
				>
					PDF
				</div>
				<div class=" flex flex-col ml-4">
					<h3 class=" text-sm font-medium text-stone-800">{title}</h3>
					<h4 class=" text-sm font-medium text-stone-500">{$_('common.branch')} - {displayName}</h4>
				</div>
			</div>
			<Button onClick={() => undefined} classes=" inline shadow-custom !py-1"
			>{$_('common.download')}</Button
			>
		</div>
	{/each}
</section>
