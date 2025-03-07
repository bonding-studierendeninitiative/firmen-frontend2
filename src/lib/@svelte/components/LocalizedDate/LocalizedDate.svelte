<script lang="ts">

	import dayjs from 'dayjs';
	import type { HTMLAttributes } from 'svelte/elements';
	import { locale } from '@services';

	type $$Props = HTMLAttributes<HTMLSpanElement> & {
		date: any;
		format?: 'long' | 'short' | 'medium' | 'relative' | string;
		hoverFormat?: 'long' | 'short' | 'medium' | 'relative' | 'none';
	};

	export let date: $$Props['date'];
	export let format: $$Props['format'] = 'relative';
	export let hoverFormat: $$Props['hoverFormat'] = 'long';

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

	$: dayjsDate = dayjs(date, { locale: $locale ?? "de" });

</script>

{#if dayjsDate}
	<span {...$$restProps} title={hoverFormat !== 'none' ? getDateForFormat(dayjsDate, hoverFormat) : undefined}>
		{getDateForFormat(dayjsDate, format)}
	</span>
{/if}