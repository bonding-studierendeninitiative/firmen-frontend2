<script lang="ts">
	export let checked: boolean = false;
	export let label: string = '';
	export let labelClasses: string = '';
</script>

<div class="flex items-center">
	<input
		bind:checked
		id={label}
		type="checkbox"
		value=""
		class="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded cursor-pointer"
	/>
	{#if label}
		<label
			for={label}
			class={'ms-4 text-sm font-medium text-stone-800 cursor-pointer '.concat(labelClasses)}
			>{label}</label
		>
	{/if}
</div>
