<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TelInput, normalizedCountries, isSelected, clickOutsideAction } from 'svelte-tel-input';
	import 'svelte-tel-input/styles/flags.css';
	import type { Country, DetailedValue } from 'svelte-tel-input/types';
	import type { CountryCode } from 'libphonenumber-js/types';
	import { cn } from '@/utils/tailwind';

	export let clickOutside = true;
	export let closeOnClick = true;
	export let disabled = false;
	export let detailedValue: Partial<DetailedValue> | null = null;
	export let value = '';
	export let searchPlaceholder = 'Search';
	export let name: string | undefined;
	export let label: string | undefined;
	export let required: boolean = false;

	let searchText = '';
	let isOpen = false;
	export let selectedCountry: CountryCode = 'DE';
	export let valid = true;
	export let options = { invalidateOnCountryChange: true };

	$: selectedCountryDialCode =
		normalizedCountries.find((el) => el.iso2 === selectedCountry)?.dialCode || null;

	const toggleDropDown = (e: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = (e: Event) => {
		if (closeOnClick) closeDropdown(e);
	};

	const closeOnClickOutside = (e: Event) => {
		if (clickOutside) {
			closeDropdown(e);
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase();
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aStartsWith = aNameLower.startsWith(normalizedText);
			const bStartsWith = bNameLower.startsWith(normalizedText);
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1) return a.id.localeCompare(b.id);
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			const aWeight = aIndex + (aStartsWith ? 0 : 1);
			const bWeight = bIndex + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	const handleSelect = (val: string, e: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onChange(val);
			selectClick(e);
		} else {
			dispatch('same', { option: val });
			selectClick(e);
		}
	};

	const dispatch = createEventDispatcher();

	const onChange = (selectedCountry: string) => {
		dispatch('change', { option: selectedCountry });
	};
</script>

<div class={cn($$props.class)}>
	{#if label}
		<label class="block mb-1.5 font-medium marker:text-sm text-stone-800" for={name}
			>{label}
			{#if required}
				<span class="text-pink-500">*</span>
			{/if}
		</label>
	{/if}

	<div
		class="flex relative rounded-lg {valid
			? ``
			: ` ring-pink-500 dark:ring-pink-500 ring-1 focus-within:ring-offset-1 focus-within:ring-offset-pink-500/50 focus-within:ring-1`}"
	>
		<div class="flex" use:clickOutsideAction={closeOnClickOutside}>
			<button
				id="states-button"
				data-dropdown-toggle="dropdown-states"
				class="relative flex-shrink-0 overflow-hidden z-3 whitespace-nowrap inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
				type="button"
				role="combobox"
				aria-controls="dropdown-countries"
				aria-expanded="false"
				aria-haspopup="false"
				on:click={toggleDropDown}
			>
				{#if selectedCountry && selectedCountry !== null}
					<div class="inline-flex items-center text-left">
						<span class="flag flag-{selectedCountry.toLowerCase()} flex-shrink-0 mr-3" />
						<span class="text-gray-600 dark:text-gray-400">+{selectedCountryDialCode}</span>
					</div>
				{:else}
					Please select
				{/if}
				<svg
					aria-hidden="true"
					class="ml-1 w-4 h-4 {isOpen ? 'rotate-180' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<input name="countryCode" type="hidden" bind:value={selectedCountry} />
			{#if isOpen}
				<div
					id="dropdown-countries"
					class="absolute z-10 max-w-fit bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 overflow-hidden translate-y-11"
					data-popper-reference-hidden=""
					data-popper-escaped=""
					data-popper-placement="bottom"
					aria-orientation="vertical"
					aria-labelledby="country-button"
					tabindex="-1"
				>
					<div
						class="text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto"
						aria-labelledby="countries-button"
						role="listbox"
					>
						<input
							aria-autocomplete="list"
							type="text"
							class="px-4 py-2 text-gray-900 focus:outline-none w-full sticky top-0"
							bind:value={searchText}
							placeholder={searchPlaceholder}
						/>
						{#each sortCountries(normalizedCountries, searchText) as country (country.id)}
							{@const isActive = isSelected(country.iso2, selectedCountry)}
							<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
								<button
									value={country.iso2}
									type="button"
									class="inline-flex py-2 px-4 w-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600
                             active:bg-gray-600 dark:active:bg-gray-800 overflow-hidden
                            {isActive
										? 'bg-gray-600 dark:text-white'
										: 'dark:hover:text-white dark:text-gray-400'}"
									on:click={(e) => {
										handleSelect(country.iso2, e);
									}}
								>
									<div class="inline-flex items-center text-left">
										<span class="flag flag-{country.iso2.toLowerCase()} flex-shrink-0 mr-3" />
										<span class="mr-2">{country.name}</span>
										<span class="text-gray-500">+{country.dialCode}</span>
									</div>
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<TelInput
			id="tel-input"
			bind:country={selectedCountry}
			bind:detailedValue
			bind:value
			bind:valid
			{name}
			{options}
			{required}
			class="text-sm rounded-r-lg block w-full p-2.5 focus:outline-none border border-gray-300 border-l-gray-100 dark:border-l-gray-700 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
        dark:placeholder-gray-400 dark:text-white text-gray-900"
		/>
	</div>
</div>
