<script lang="ts">
	import { LogoItem, NoDataFound } from '@/@svelte/components';
	import type { PageServerData } from './$types';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageServerData;

</script>

{#await data.logos}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then logos}
	<div in:fade>
		{#if !logos?.length}
			<NoDataFound heading="No logos found" subHeading="You can add logos to your organization" buttonText="Add logo"
									 onButtonClick={() => {

		}} />
		{:else }
			{@const groupedLogos = logos?.reduce((acc, logo) => {
				const year = dayjs(logo.eventRegistration.createdAt).year();

				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(logo);
				return acc;
			}, {})}
			{#each Object.entries(groupedLogos || {}) as [year, logos]}
				<div class="space-y-4">
					<h2 class="text-xl font-bold border-b">{year}</h2>
					<div class="grid grid-cols-2 gap-4">
						{#each logos as logo}
							<LogoItem {logo} />
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
{:catch error}
	<p>{error.message}</p>
{/await}
