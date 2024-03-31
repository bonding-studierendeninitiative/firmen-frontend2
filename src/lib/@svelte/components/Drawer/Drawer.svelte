<script lang="ts">
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Button from '../Button/Button.svelte';
	import GradientButton from '../GradientButton/GradientButton.svelte';

	export let hasActions: boolean = true;
	export let isOpen: boolean;
	export let heading: string = '';
	export let handleSubmit: () => void;
	export let handleCancel: () => void = () => {
		isOpen = false;
	};

	function toggleDrawer() {
		isOpen = !isOpen;
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 flex z-50 transition duration-150 ease-in-out"
		transition:fade={{
			duration: 300,
			easing: cubicOut
		}}
	>
		<button class="fixed inset-0 transition-opacity" on:click={toggleDrawer}>
			<div class="absolute inset-0 bg-black opacity-50"></div>
		</button>
		<div
			transition:fly={{
				x: 100,
				duration: 300,
				easing: cubicOut
			}}
			class=" fixed p-6 inset-y-0 right-0 flex flex-col w-[556px] bg-white border-r h-screen"
		>
			<div class="flex items-center justify-between pb-6 pt-2 border-b">
				<span class=" font-bold text-stone-800 text-xl">{heading}</span>
				<button class="text-stone-400 focus:outline-none" on:click={toggleDrawer}>
					<CrossIcon />
				</button>
			</div>
			<div class="pt-6 flex flex-col justify-between h-full">
				<section>
					<slot />
				</section>
				{#if hasActions}
					<footer class=" flex justify-end items-center w-full">
						<Button classes="mr-2" onClick={handleCancel}>Cancel</Button>
						<GradientButton onClick={handleSubmit}>Save</GradientButton>
					</footer>
				{/if}
			</div>
		</div>
	</div>
{/if}
