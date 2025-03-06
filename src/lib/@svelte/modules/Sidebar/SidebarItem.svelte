<script lang="ts">
	import { cn } from '@/utils/tailwind';
	import { _ } from '@services';
	import * as Icons from '$lib/@svelte/icons';

	export let href;
	export let label;
	export let active: boolean;
	export let icon: keyof typeof Icons;

</script>

<a
	{href}
	aria-label={$_(`sidebar.${label}`)}
	class={cn(`relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white`, {
		"bg-brand": active
	})}
>
	<svelte:component this={Icons[icon]} />
	<span class="-mr-1 font-medium">{$_(`sidebar.${label}`)}</span>
</a>