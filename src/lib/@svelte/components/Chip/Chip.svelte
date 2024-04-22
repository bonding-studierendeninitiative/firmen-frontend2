<script lang="ts">
	export let status: string;
	export let variant: 'success' | 'info' | 'brand';
	export let classes: string = '';

	const getStylesByVariant = () => {
		switch (variant) {
			case 'success':
				return 'text-orange-500 bg-orange-100';
			case 'info':
				return 'text-green-600 bg-green-50';
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
	{status}
</p>
