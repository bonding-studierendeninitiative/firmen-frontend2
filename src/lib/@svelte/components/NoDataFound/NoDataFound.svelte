<script lang="ts">
	import { Button } from '@/components/ui/button';

	interface Props {
		heading?: string;
		subHeading?: string;
		buttonText?: string;
		onButtonClick: () => void;
	}

	let {
		heading = '',
		subHeading = '',
		buttonText = '',
		onButtonClick
	}: Props = $props();
</script>

<div class=" py-10 flex flex-col justify-center items-center bg-stone-50">
	<h2 class=" text-base font-extrabold text-stone-950 text-center lg:text-left">{heading}</h2>
	<p class="text-balance w-2/6 text-center text-stone-500 mb-3">{subHeading}</p>
	{#if buttonText.length > 0}
		<Button variant="default" class="mt-2"  onclick={onButtonClick}>{buttonText}</Button>
	{/if}
</div>
