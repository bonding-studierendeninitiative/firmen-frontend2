<script lang="ts">
	import { cn } from '@/utils/tailwind';
	import { _ } from '@services';
	import * as Icons from '$lib/@svelte/icons';

	interface Props {
		href: any;
		label: any;
		active: boolean;
		icon: keyof typeof Icons;
	}

	let {
		href,
		label,
		active,
		icon
	}: Props = $props();


	const SvelteComponent = $derived(Icons[icon]);
</script>

<a
	{href}
	aria-label={$_(`sidebar.${label}`)}
	class={cn(`relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white`, {
		"bg-brand": active
	})}
>
	<SvelteComponent />
	<span class="-mr-1 font-medium">{$_(`sidebar.${label}`)}</span>
</a>