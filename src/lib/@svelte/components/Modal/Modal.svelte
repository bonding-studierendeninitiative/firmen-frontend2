<script lang="ts">
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let isOpen: boolean;

	function toggleDrawer() {
		isOpen = !isOpen;
	}
</script>

{#if isOpen}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-black opacity-20 transition-opacity w-full h-full"
			transition:fade={{
				duration: 300,
				easing: cubicOut
			}}
		></div>

		<div
			role="button"
			tabindex="0"
			on:keydown={undefined}
			class="fixed inset-0 z-10 w-screen overflow-y-auto"
			on:click={toggleDrawer}
		>
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					role="button"
					tabindex="0"
					on:keydown={undefined}
					transition:fade={{
						duration: 500,
						easing: cubicOut
					}}
					on:click={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					class="p-10 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
