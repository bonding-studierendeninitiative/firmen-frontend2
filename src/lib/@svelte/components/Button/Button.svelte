<script lang="ts">
	export let classes = '';
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class={' font-extrabold px-4 py-3 space-x-4 rounded-lg text-stone-800 text-sm w-auto border border-solid border-stone-200 '.concat(
		classes
	)}
>
	<slot />
</button>
