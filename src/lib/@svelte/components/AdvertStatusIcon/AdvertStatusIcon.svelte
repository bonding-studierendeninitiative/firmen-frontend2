<script lang="ts">

	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '@/utils/tailwind';

	export let variant: VariantProps<typeof advertStatusIconVariants>;
	export let title: string = "";

	const advertStatusIconVariants = tv({
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

<span {title} >
<svg class={cn(advertStatusIconVariants({variant}))} xmlns="http://www.w3.org/2000/svg" width="25" height="24"
		 viewBox="0 0 25 24" fill="none">
	<path
		d="M10.5 17H19.5V11H10.5V17ZM4.5 20C3.95 20 3.47917 19.8042 3.0875 19.4125C2.69583 19.0208 2.5 18.55 2.5 18V6C2.5 5.45 2.69583 4.97917 3.0875 4.5875C3.47917 4.19583 3.95 4 4.5 4H20.5C21.05 4 21.5208 4.19583 21.9125 4.5875C22.3042 4.97917 22.5 5.45 22.5 6V18C22.5 18.55 22.3042 19.0208 21.9125 19.4125C21.5208 19.8042 21.05 20 20.5 20H4.5ZM4.5 18H20.5V6H4.5V18Z"
		fill="currentColor"
	/>
</span>