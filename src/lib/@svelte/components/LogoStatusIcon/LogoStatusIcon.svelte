<script lang="ts">

	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '@/utils';

	export let variant: VariantProps<typeof logoStatusIconVariants>;

	const logoStatusIconVariants = tv({
		variants: {
			variant: {
				missing: 'text-stone-500',
				uploaded: 'text-fuchsia-500',
				'changes-requested': 'text-yellow-500',
				rejected: 'text-red-500',
				confirmed: 'text-emerald-500'
			}
		},
		defaultVariants: { variant: 'missing' }
	});

</script>

<span title={variant} >
<svg class={cn(logoStatusIconVariants({variant}))} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
		 viewBox="0 0 25 24" fill="none">
	<path
		d="M5.5 21C4.95 21 4.47917 20.8042 4.0875 20.4125C3.69583 20.0208 3.5 19.55 3.5 19V5C3.5 4.45 3.69583 3.97917 4.0875 3.5875C4.47917 3.19583 4.95 3 5.5 3H19.5C20.05 3 20.5208 3.19583 20.9125 3.5875C21.3042 3.97917 21.5 4.45 21.5 5V19C21.5 19.55 21.3042 20.0208 20.9125 20.4125C20.5208 20.8042 20.05 21 19.5 21H5.5ZM5.5 19H19.5V5H5.5V19ZM6.5 17H18.5L14.75 12L11.75 16L9.5 13L6.5 17Z"
		fill="currentColor"
	/>
</svg>
</span>