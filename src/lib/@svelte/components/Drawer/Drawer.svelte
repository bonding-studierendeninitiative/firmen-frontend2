<script lang="ts">
	import { _ } from '@services';
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Button from '../Button/Button.svelte';
	import GradientButton from '../GradientButton/GradientButton.svelte';

	interface Props {
		hasActions?: boolean;
		isOpen: boolean;
		heading?: string;
		handleSubmit: () => void;
		handleCancel?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		hasActions = true,
		isOpen = $bindable(),
		heading = '',
		handleSubmit,
		handleCancel = () => {
		isOpen = false;
	},
		children
	}: Props = $props();

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
		<button aria-label="Toggle Drawer"  class="fixed inset-0 transition-opacity" onclick={toggleDrawer}>
			<span class="absolute inset-0 bg-black opacity-50"></span>
		</button>
		<div
			transition:fly={{
				x: 100,
				duration: 300,
				easing: cubicOut
			}}
			class=" fixed p-6 inset-y-0 right-0 flex flex-col w-[556px] bg-white border-r h-screen max-h-[100vh] overflow-auto"
		>
			<div class="flex items-center justify-between pb-6 pt-2">
				<span class=" font-bold text-stone-800 text-xl">{heading}</span>
				<button class="text-stone-400 focus:outline-none" onclick={toggleDrawer}>
					<CrossIcon />
				</button>
			</div>
			<hr class=" -mx-6" />
			<div class="pt-6 flex flex-col justify-between h-full">
				{@render children?.()}

				{#if hasActions}
					<footer class=" flex justify-end items-center w-full">
						<Button classes="mr-2" onClick={handleCancel}>{$_('common.cancel')}</Button>
						<GradientButton onClick={handleSubmit}>{$_('common.save')}</GradientButton>
					</footer>
				{/if}
			</div>
		</div>
	</div>
{/if}
