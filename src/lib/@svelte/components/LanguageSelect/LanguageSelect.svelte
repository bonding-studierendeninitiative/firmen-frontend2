<script lang="ts">
	import { SelectDown, SelectUp } from '$lib/@svelte/icons';
	import Select from 'svelte-select';
	import { locale } from '@services';

	let items = [
		{ value: 'en', label: 'en' },
		{ value: 'de', label: 'de' }
	] as const;
	$: value = items.find((item) => item.value === $locale) ?? items[0];
	let listOpen = false;
	const handleLangChange = (e: any) => {
		$locale = e.detail.value ?? 'en';
	};
</script>

<div class=" w-18">
	<Select
		{items}
		clearable={false}
		showChevron
		bind:listOpen
		{value}
		searchable={false}
		on:select={handleLangChange}
		inputStyles=" text-align:center"
		--height="28px"
		--font-size="18px"
		--selected-item-padding="0px"
		--border="none"
		--border-focused="none"
		--border-hover="none"
	>
		<div slot="chevron-icon" class=" text-stone-400 text-xs">
			{#if listOpen}
				<SelectUp />
			{:else}
				<SelectDown />
			{/if}
		</div>
	</Select>
</div>
