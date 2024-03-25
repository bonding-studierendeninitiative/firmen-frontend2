<script lang="ts">
	export let classes = '';
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class={'justify-center items-center relative font-extrabold px-4 py-3 space-x-4 rounded-lg text-white text-sm '.concat(
		classes
	)}
>
	<slot />
</button>
