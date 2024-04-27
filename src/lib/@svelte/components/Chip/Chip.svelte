<script lang="ts">
	import { _ } from '@services';

	export let status: string;
	export let variant: any;
	export let classes: string = '';

	const getStylesByVariant = () => {
		switch (variant) {
			case 'success':
			case 'confirmed':
				return 'text-green-600 bg-green-50';
			case 'info':
			case 'verification':
				return 'text-orange-500 bg-orange-100';
			case 'rejected':
				return 'text-red-500 bg-red-100';
			case 'brand':
				return 'text-brand bg-brand bg-opacity-5';

			default:
				return 'text-green-600 bg-green-50';
		}
	};
	export let handleChipClick: (() => void) | undefined = undefined;
</script>

<p
	on:click={() => handleChipClick?.()}
	class={' rounded-custom w-auto px-[10px] py-[2px] text-sm font-normal text-center  '.concat(
		getStylesByVariant()
	) + ' '.concat(classes)}
>
	{$_(`status-text.${status}`)}
</p>
