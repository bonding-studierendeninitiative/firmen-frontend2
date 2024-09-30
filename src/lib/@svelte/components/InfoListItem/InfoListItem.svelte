<script lang="ts">
	import { Event } from '@/@svelte/components/Event';
	import { Button } from '@/components/ui/button';
	export let showButton = true;
	export let heading: string;
	export let subHeading: string;
	export let date: string;
	export let buttonText: string;
	export let onRegisterClick: (() => void) | undefined = undefined;
</script>

<div class=" p-4 shadow-custom rounded-md border border-solid border-stone-200">
	<div class=" flex justify-between items-start">
		<Event event={{dateFrom: date, location: subHeading, name: heading}} />
		{#if showButton}
			<Button size="sm" variant="secondary" class="!py-1.5" on:click={() => onRegisterClick?.()}>
				{buttonText}
			</Button>
		{/if}
	</div>
</div>
