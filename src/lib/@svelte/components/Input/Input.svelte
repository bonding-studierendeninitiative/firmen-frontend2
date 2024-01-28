<script lang="ts">
	export let placeholder = '';
	export let classes = '';
</script>

<input
	{placeholder}
	type="text"
	class={'rounded-lg w-full border border-solid border-gray-300 bg-white shadow-md flex p-2 pl-3 items-center gap-2 focus:outline-none focus:ring focus:border-blue-500 '.concat(
		classes
	)}
/>
