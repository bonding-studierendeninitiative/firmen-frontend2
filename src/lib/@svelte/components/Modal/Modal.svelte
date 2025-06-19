<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	interface Props {
		isOpen: boolean;
		children?: import('svelte').Snippet;
	}

	let { isOpen = $bindable(), children }: Props = $props();

	function toggleDrawer() {
		isOpen = !isOpen;
	}
</script>

{#if isOpen}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div
			class="fixed inset-0 bg-black opacity-20 transition-opacity size-full"
			transition:fade={{
				duration: 300,
				easing: cubicOut
			}}
		></div>

		<div
			role="button"
			tabindex="0"
			onkeydown={undefined}
			class="fixed inset-0 z-10 w-screen overflow-y-auto"
			onclick={toggleDrawer}
		>
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					role="button"
					tabindex="0"
					onkeydown={undefined}
					transition:fade={{
						duration: 500,
						easing: cubicOut
					}}
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					class="py-10 px-10 transform cursor-default overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					{@render children?.()}
				</div>
			</div>
		</div>
	</div>
{/if}
