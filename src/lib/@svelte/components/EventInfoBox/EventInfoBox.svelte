<script lang="ts">
	import { _ } from '@services';
	import { CalenderIcon } from '$lib/@svelte/icons';
	import { GradientLink } from '$lib/@svelte/components';

	export let heading: string;
	export let subHeading: string;
	export let date: string;
	export let buttonText: string = 'register';
	export let href: string;
</script>

<div class=" p-6 shadow-custom rounded-md border border-solid border-stone-200">
	<h4 class=" text-lg font-extrabold text-stone-800">{heading}</h4>
	<h6 class=" text-sm text-stone-800 font-normal">{subHeading}</h6>
	<div class=" flex justify-between items-center mt-5">
		<span class=" flex items-center">
			<CalenderIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{date}</p>
		</span>
		<GradientLink class=" !py-1.5" {href}>{$_(`common.${buttonText}`)}</GradientLink>
	</div>
</div>
