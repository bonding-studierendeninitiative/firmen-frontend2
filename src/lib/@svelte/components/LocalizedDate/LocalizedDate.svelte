<script lang="ts">

	import dayjs from 'dayjs';
	import type { HTMLAttributes } from 'svelte/elements';
	import { locale } from '@services';

	type $$Props = HTMLAttributes<HTMLSpanElement> & {
		date: any;
		format?: 'long' | 'short' | 'medium' | 'relative' | string;
		hoverFormat?: 'long' | 'short' | 'medium' | 'relative' | 'none';
	};

	interface Props {
		date: $$Props['date'];
		format?: $$Props['format'];
		hoverFormat?: $$Props['hoverFormat'];
		[key: string]: any
	}

	let { date, format = 'relative', hoverFormat = 'long', ...rest }: Props = $props();

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

	let dayjsDate = $derived(dayjs(date, { locale: $locale ?? "de" }));

</script>

{#if dayjsDate}
	<span {...rest} title={hoverFormat !== 'none' ? getDateForFormat(dayjsDate, hoverFormat) : undefined}>
		{getDateForFormat(dayjsDate, format)}
	</span>
{/if}