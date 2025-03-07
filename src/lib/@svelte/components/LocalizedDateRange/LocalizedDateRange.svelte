<script lang="ts">

	import dayjs from 'dayjs';
	import type { HTMLAttributes } from 'svelte/elements';
	import { locale } from '@services';
	import { cn } from '@/utils';

	type $$Props = HTMLAttributes<HTMLSpanElement> & {
		dateFrom: string;
		dateTo: string;
		format?: 'long' | 'short' | 'medium' | 'relative' | string;
		hoverFormat?: 'long' | 'short' | 'medium' | 'relative' | 'none';
	};

	export let dateFrom: $$Props['dateFrom'];
	export let dateTo: $$Props['dateTo'];
	export let format: $$Props['format'] = 'relative';
	export let hoverFormat: $$Props['hoverFormat'] = 'long';
	let className: $$Props["class"] = undefined;
	export { className as class };

	function getDateForFormat(dayjs: dayjs.Dayjs, format: $$Props['format']) {
		switch (format) {
			case 'long':
				return dayjs.format('LLLL');
			case 'short':
				return dayjs.format('L');
			case 'medium':
				return dayjs.format('ll');
			case 'relative':
				return dayjs.fromNow();
			default:
				return dayjs.format(format);
		}
	}

	$: dayjsDateFrom = dayjs(dateFrom, { locale: $locale ?? "de" });
	$: dayjsDateTo = dayjs(dateTo, { locale: $locale ?? "de" });

</script>

{#if dayjsDateFrom && dayjsDateTo}
	<span class={cn("text-nowrap", className)} {...$$restProps} title={hoverFormat !== 'none' ? `${getDateForFormat(dayjsDateFrom, hoverFormat)} - ${getDateForFormat(dayjsDateFrom, hoverFormat)}` : undefined}>
		{getDateForFormat(dayjsDateFrom, format)}
		{"-"}
		{getDateForFormat(dayjsDateTo, format)}
	</span>
{/if}