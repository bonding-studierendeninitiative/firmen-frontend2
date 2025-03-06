<script lang="ts">

	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '@/utils/tailwind';

	export let variant: VariantProps<typeof portraitStatusIconVariants>;
	export let title: string = "";

	const portraitStatusIconVariants = tv({
		variants: {
			variant: {
				missing: 'text-stone-500',
				draft: 'text-fuchsia-500',
				submitted: 'text-blue-700',
				'changes-requested': 'text-yellow-500',
				rejected: 'text-red-500',
				confirmed: 'text-emerald-500'
			}
		},
		defaultVariants: { variant: 'missing' }
	});

</script>

<span {title}>
<svg class={cn(portraitStatusIconVariants({variant}))} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
		 viewBox="0 0 25 24" fill="none">
	<path
		d="M8.5 18H16.5V16H8.5V18ZM8.5 14H16.5V12H8.5V14ZM6.5 22C5.95 22 5.47917 21.8042 5.0875 21.4125C4.69583 21.0208 4.5 20.55 4.5 20V4C4.5 3.45 4.69583 2.97917 5.0875 2.5875C5.47917 2.19583 5.95 2 6.5 2H14.5L20.5 8V20C20.5 20.55 20.3042 21.0208 19.9125 21.4125C19.5208 21.8042 19.05 22 18.5 22H6.5ZM13.5 9V4H6.5V20H18.5V9H13.5Z"
		fill="currentColor"
	/>
</svg>
</span>