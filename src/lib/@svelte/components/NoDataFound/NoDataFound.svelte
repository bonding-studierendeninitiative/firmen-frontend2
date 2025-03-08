<script lang="ts">
	import { Button } from '@/components/ui/button';

	export let heading: string = '';
	export let subHeading: string = '';
	export let buttonText: string = '';
	export let onButtonClick: () => void;
</script>

<div class=" py-10 flex flex-col justify-center items-center bg-stone-50">
	<h2 class=" text-base font-extrabold text-stone-950">{heading}</h2>
	<p class="text-balance w-2/6 text-center text-stone-500 mb-3">{subHeading}</p>
	{#if buttonText.length > 0 }
		<Button variant="default" classes="mt-6"  on:click={onButtonClick}>{buttonText}</Button>
	{/if}
</div>
