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

	interface Props {
		dateFrom: $$Props['dateFrom'];
		dateTo: $$Props['dateTo'];
		format?: $$Props['format'];
		hoverFormat?: $$Props['hoverFormat'];
		class?: $$Props["class"];
		[key: string]: any
	}

	let {
		dateFrom,
		dateTo,
		format = 'relative',
		hoverFormat = 'long',
		class: className = undefined,
		...rest
	}: Props = $props();
	

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

	let dayjsDateFrom = $derived(dayjs(dateFrom, { locale: $locale ?? "de" }));
	let dayjsDateTo = $derived(dayjs(dateTo, { locale: $locale ?? "de" }));

</script>

{#if dayjsDateFrom && dayjsDateTo}
	<span class={cn("text-nowrap", className)} {...rest} title={hoverFormat !== 'none' ? `${getDateForFormat(dayjsDateFrom, hoverFormat)} - ${getDateForFormat(dayjsDateFrom, hoverFormat)}` : undefined}>
		{getDateForFormat(dayjsDateFrom, format)}
		{"-"}
		{getDateForFormat(dayjsDateTo, format)}
	</span>
{/if}