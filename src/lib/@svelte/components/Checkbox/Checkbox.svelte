<script lang="ts">
	export let checked: boolean = false;
	export let label: string = '';
	export let labelClasses: string = '';
</script>

<div class="flex items-center">
	<input
		bind:checked
		id="checked-checkbox"
		type="checkbox"
		value=""
		class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded"
	/>
	{#if label}
		<label
			for="checked-checkbox"
			class={'ms-4 text-sm font-medium text-stone-800 '.concat(labelClasses)}>{label}</label
		>
	{/if}
</div>
