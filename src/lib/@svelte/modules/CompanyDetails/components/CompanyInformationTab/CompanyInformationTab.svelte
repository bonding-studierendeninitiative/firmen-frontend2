<script lang="ts">
	import { _ } from '@services';
	export const companyInfo = [
		{ label: 'company', value: 'Techwerk GmbH' },
		{ label: 'contactPerson', value: 'James McDonald' },
		{ label: 'address', value: 'Luxemburger Str. 72, 50674' },
		{ label: 'city', value: 'Köln' },
		{ label: 'federalState', value: 'NRW' },
		{ label: 'number', value: '+49 151 10 1000 93' },
		{ label: 'emailAddress', value: 'name@company.com' }
	];
</script>

<section>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		{#each companyInfo as { label, value } (label)}
			<p class=" font-normal text-sm text-stone-500">{$_(`admin-pages.companies.${label}`)}</p>
			<p class=" w-full text-right font-normal text-sm text-stone-800">{value}</p>{/each}
	</div>
</section>
