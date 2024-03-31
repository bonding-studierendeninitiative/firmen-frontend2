<script lang="ts">
	import CrossIcon from '$lib/@svelte/icons/CrossIcon.svelte';
	export let isClearable: boolean = false;
</script>

<p
	class="m-0 px-2.5 py-0.5 bg-brand-light text-brand rounded-full w-auto inline-flex items-center justify-between"
>
	<slot />
	{#if isClearable}
		<span class=" p-0 m-0 ml-1 cursor-pointer">
			<CrossIcon classes="!h-4 !w-4 " strokeWidth="2" />
		</span>
	{/if}
</p>
