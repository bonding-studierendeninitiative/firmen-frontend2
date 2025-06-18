<script lang="ts">
	interface Props {
		classes?: string;
		onClick: () => void;
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { classes = '', onClick, children, ...rest }: Props = $props();
</script>

<button
	onclick={onClick}
	class={' font-extrabold px-4 py-3 space-x-4 rounded-lg text-stone-800 text-sm w-auto border border-solid border-stone-200 '.concat(
		classes
	)}
	{...rest}
>
	{@render children?.()}
</button>
