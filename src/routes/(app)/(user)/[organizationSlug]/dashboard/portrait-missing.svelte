<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';

	let { submitPortraitOpen = $bindable(false) }: { submitPortraitOpen: boolean } = $props();
</script>

<div class="rounded-xl border border-dashed border-red-400 p-4 flex flex-col items-center gap-4">
	<span>
		{$_('components.registration-card.portrait-missing.description')}
	</span>
	<Button variant="default" on:click={() => (submitPortraitOpen = true)}
		>{$_('components.registration-card.portrait-missing.action')}</Button
	>
</div>
