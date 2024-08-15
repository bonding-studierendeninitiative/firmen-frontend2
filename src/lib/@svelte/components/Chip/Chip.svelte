<script lang="ts">
	import { _ } from '@services';
	import { cn } from '@/utils';

	export let status: string;
	export let variant: variant;
	export let classes: string = '';

	type variant = 'success' | 'confirmed' | 'info' | 'verification' | 'created' | 'rejected' | 'withdrawn' | 'brand';

	const getStylesByVariant = () => {
		switch (variant) {
			case 'success':
			case 'confirmed':
				return 'text-green-600 bg-green-50';
			case 'info':
			case 'verification':
			case 'created':
				return 'text-orange-500 bg-orange-100';
			case 'rejected':
			case 'withdrawn':
				return 'text-red-500 bg-red-100';
			case 'brand':
				return 'text-brand bg-brand bg-opacity-5';

			default:
				return 'text-green-600 bg-green-50';
		}
	};
</script>

<p
	class={cn(' rounded-custom w-auto px-[10px] py-[2px] text-sm font-normal text-center  ', getStylesByVariant(), classes)}
>
	{$_(`status-text.${status}`)}
</p>
