<script lang="ts">
	import { CalenderIcon, MessageIcon } from '$lib/@svelte/icons';
	import { GradientButton, Button } from '$lib/@svelte';
	import FilledCheckIcon from '$lib/@svelte/icons/FilledCheckIcon.svelte';

	// export let heading: string;
	// export let subHeading: string;
	// export let date: string;
	// export let onRegisterClick: () => void;
	const onActionButtonClick = () => {};
</script>

<div
	class="p-4 mb-3 flex justify-between items-center shadow-custom rounded-md border border-solid border-stone-200"
>
	<div class=" flex">
		<div class={`rounded-lg inline-flex justify-center items-start mt-1 `}>
			<MessageIcon />
			<!-- <FilledCheckIcon /> -->
		</div>
		<div class=" flex flex-col ml-4">
			<h3 class=" text-base text-stone-500">
				You registration for Tech Foundation 2023 has been approved. Please select your portrait for
				the event and update your event information.
			</h3>
			<Button
				onClick={onActionButtonClick}
				classes="  shadow-custom  !text-stone-500 border border-solid border-stone-200 !py-1 text-stone-800"
				>Update Portrait</Button
			>
			<p class="mt-2 text-sm text-stone-400 font-medium">40 mins ago</p>
		</div>
	</div>
</div>
