<script lang="ts">
	import { SelectDown, SelectUp } from '$lib/@svelte/icons';
	import Select from 'svelte-select';
	import { setupI18n } from '@services';

	let items = [
		{ value: 'en', label: 'en' },
		{ value: 'de', label: 'de' }
	];
	let value = { value: 'de', label: 'de' };
	let listOpen = false;
	const handleLangChange = (e: any) => {
		const lang = e.detail.value ?? 'en';
		setupI18n({ withLocale: lang });
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
		containerStyles="box-shadow: 0px 1.5px 4px -1px rgba(0, 0, 0, 0.08); height:40px !important; "
		--height="28px"
		--font-size="14px"
		--selected-item-padding="0px"
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
