<script lang="ts">
	interface Props {
		classes?: string;
		onClick: () => void;
		children?: import('svelte').Snippet;
	}

	let { classes = '', onClick, children }: Props = $props();
</script>

<button
	onclick={onClick}
	class={'px-3 py-2.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-400 '.concat(
		classes
	)}
>
	{@render children?.()}
</button>
