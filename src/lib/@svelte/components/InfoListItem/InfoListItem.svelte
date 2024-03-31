<script lang="ts">
	import { CalenderIcon, LocationIcon } from '$lib/@svelte/icons';
	import { GradientButton } from '$lib/@svelte/components';
	export let showButton = true;
	export let heading: string;
	export let subHeading: string;
	export let date: string;
	export let onRegisterClick: (() => void) | undefined = undefined;
</script>

<div class=" p-4 shadow-custom rounded-md border border-solid border-stone-200">
	<div class=" flex justify-between items-start">
		<div>
			<h4 class=" text-lg font-extrabold text-stone-800">{heading}</h4>
			<div class=" flex mt-2">
				<span class=" flex items-center mr-2">
					<CalenderIcon />
					<p class=" ml-2 text-sm text-stone-800 font-medium">{date}</p>
				</span>
				<span class=" flex items-center">
					<LocationIcon />
					<p class=" ml-2 text-sm text-stone-800 font-medium">{subHeading}</p>
				</span>
			</div>
		</div>
		{#if showButton}
			<GradientButton classes=" !py-1.5" onClick={() => onRegisterClick?.()}
				>View Applies</GradientButton
			>
		{/if}
	</div>
</div>
