<script lang="ts">
	import GradientButton from '../GradientButton/GradientButton.svelte';

	export let heading: string = '';
	export let subHeading: string = '';
	export let buttonText: string = '';
	export let onButtonClick: () => void;
</script>

<div class=" py-10 flex flex-col justify-center items-center bg-stone-50">
	<h2 class=" text-base font-extrabold text-stone-950">{heading}</h2>
	<p class="text-balance w-2/6 text-center text-stone-500">{subHeading}</p>
	{#if buttonText.length > 0 }
		<GradientButton classes="mt-6 " onClick={onButtonClick}>{buttonText}</GradientButton>
	{/if}
</div>
