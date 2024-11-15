<script lang="ts">
	import { SelectDown, SelectUp } from '$lib/@svelte/icons';
	import Select from 'svelte-select';
	import { setupI18n, locale } from '@services';
	import { onMount } from 'svelte';

	let items = [
		{ value: 'en', label: 'en' },
		{ value: 'de', label: 'de' }
	];
	let value = { value: 'en', label: 'en' };
	let listOpen = false;
	const handleLangChange = (e: any) => {
		const lang = e.detail.value ?? 'en';
		setupI18n({ withLocale: lang });
	};
	onMount(() => {
		if ($locale === 'de') {
			value = { value: 'de', label: 'de' };
		} else {
			value = { value: 'en', label: 'en' };
		}
	});
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
