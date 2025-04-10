<script lang="ts">
	import { NoDataFound } from '@/@svelte/components';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let isDialogOpen = getContext<Writable<boolean>>('isCreateBuyOptionDialogOpen');
</script>

<section>
	<NoDataFound
		onButtonClick={() => ($isDialogOpen = true)}
		buttonText="Create a new buy option&hellip;"
		heading="This event does not have any buy options yet."
		subHeading="Create a buy option now to enable organizations to sign up to this event."
	/>
</section>