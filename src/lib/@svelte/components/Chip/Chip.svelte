<script lang="ts">
	export let status: string;
	export let variant: 'success' | 'info';

	const getStylesByVariant = () => {
		switch (variant) {
			case 'success':
				return 'text-orange-500 bg-orange-100';
			case 'info':
				return 'text-green-600 bg-green-50';

			default:
				return 'text-green-600 bg-green-50';
		}
	};
</script>

<p
	class={' rounded-custom w-auto px-[10px] py-[2px] text-sm font-normal text-center '.concat(
		getStylesByVariant()
	)}
>
	{status}
</p>
