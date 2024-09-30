<script lang="ts">
	import { clsx } from 'clsx';
	import { cn } from '@/utils';

	export let href: string;
</script>

<a
	{...$$restProps}
	style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 100%), #007EC7;"
	class={cn('flex justify-center items-center relative px-4 py-2.5 space-x-4 rounded-lg text-white text-sm font-extrabold ', $$props.class)}
	{href}
>
	<span><slot /></span>
</a>
