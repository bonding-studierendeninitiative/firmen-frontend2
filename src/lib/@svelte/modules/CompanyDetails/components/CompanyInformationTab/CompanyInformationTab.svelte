<script lang="ts">
	export const companyInfo = [
		{ label: 'Pursue', value: 'Techwerk GmbH' },
		{ label: 'Contact Person', value: 'James McDonald' },
		{ label: 'Address', value: 'Luxemburger Str. 72, 50674' },
		{ label: 'City', value: 'Köln' },
		{ label: 'Federal State', value: 'NRW' },
		{ label: 'Number', value: '+49 151 10 1000 93' },
		{ label: 'Email Address', value: 'name@company.com' }
	];
</script>

<section>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		{#each companyInfo as { label, value } (label)}
			<p class=" font-normal text-sm text-stone-500">{label}</p>
			<p class=" w-full text-right font-normal text-sm text-stone-800">{value}</p>{/each}
	</div>
</section>
