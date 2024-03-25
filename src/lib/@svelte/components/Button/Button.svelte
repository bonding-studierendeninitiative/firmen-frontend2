<script lang="ts">
	export let classes = '';
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class={' font-extrabold px-4 py-3 space-x-4 rounded-lg text-white text-sm w-auto '.concat(
		classes
	)}
>
	<slot />
</button>
