<script lang="ts">
	export let classes = '';
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), #007EC7;"
	class={'flex justify-center items-center relative px-4 py-3 space-x-4 rounded-lg text-white text-sm font-extrabold '.concat(
		classes
	)}
>
	<p><slot /></p>
</button>
