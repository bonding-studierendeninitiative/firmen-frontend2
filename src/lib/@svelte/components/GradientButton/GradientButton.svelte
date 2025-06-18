<script lang="ts">
	interface Props {
		classes?: string;
		type?: 'button' | 'submit' | 'reset';
		onClick?: (() => void) | undefined;
		form?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let {
		classes = '',
		type = 'button',
		onClick = undefined,
		form = undefined,
		children
	}: Props = $props();
</script>

<button
	onclick={onClick}
	{type}
	{form}
	class={'flex text-nowrap justify-center bg-gradient-to-b from-white/30 to-transparent bg-brand items-center relative px-4 py-2.5 space-x-4 rounded-lg text-white text-sm font-extrabold '.concat(
		classes
	)}
>
	<span>{@render children?.()}</span>
</button>
