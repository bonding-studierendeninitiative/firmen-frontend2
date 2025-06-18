<script lang="ts">
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	interface Props {
		isClearable?: boolean;
		children?: import('svelte').Snippet;
	}

	let { isClearable = false, children }: Props = $props();
</script>

<p
	class="m-0 px-2.5 py-0.5 bg-brand-light text-brand rounded-full w-auto inline-flex items-center justify-between"
>
	{@render children?.()}
	{#if isClearable}
		<span class=" p-0 m-0 ml-1 cursor-pointer">
			<CrossIcon classes="!h-4 !w-4 " strokeWidth="2" />
		</span>
	{/if}
</p>
