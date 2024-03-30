<script lang="ts">
	import { CalenderIcon } from '$lib/@svelte/icons';
	import { GradientButton } from '$lib/@svelte/components';

	export let heading: string;
	export let subHeading: string;
	export let date: string;
	export let buttonText: string = 'Register';
	export let onRegisterClick: () => void;
</script>

<div class=" p-6 shadow-custom rounded-md border border-solid border-stone-200">
	<h4 class=" text-lg font-extrabold text-stone-800">{heading}</h4>
	<h6 class=" text-sm text-stone-800 font-normal">{subHeading}</h6>
	<div class=" flex justify-between items-center mt-5">
		<span class=" flex items-center">
			<CalenderIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{date}</p>
		</span>
		<GradientButton classes=" !py-1.5" onClick={onRegisterClick}>{buttonText}</GradientButton>
	</div>
</div>
