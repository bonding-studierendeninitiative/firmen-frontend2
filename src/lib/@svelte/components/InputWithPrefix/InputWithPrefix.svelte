<script lang="ts">
	import { ButtonGroup, InputAddon, Input, Label, type SizeType } from 'flowbite-svelte';

	export let prefixText: string = '';
	export let label: string = '';
	export let name: string = '';
	export let size: SizeType = 'md';
	export let required: boolean = false;
	export let addonClass: string = '';
	export let value: string = '';
</script>
<div>
	{#if label}
		<Label class="block mb-1.5 font-medium text-stone-800" for={name}>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</Label>
	{/if}
	<ButtonGroup {size} class="w-full">
		<InputAddon class={addonClass}>{prefixText}</InputAddon>
		<Input
			on:change={(e) => console.log(e)}
			id={name}
			{name}
			{required}
			bind:value={value}
			{...$$restProps} />
	</ButtonGroup>
</div>