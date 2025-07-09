<script lang="ts">

	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '@/utils/ui';

	interface Props {
		variant?: VariantProps<typeof statusBadgeVariants>['variant'];
		title?: string;
		label?: string;
	}

	let { variant = 'missing', title = '', label = '' }: Props = $props();

	const statusBadgeVariants = tv({
		variants: {
			variant: {
				missing: 'text-stone-500',
				uploaded: 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700',
				'changes-requested': 'text-yellow-500',
				rejected: 'border-red-600 bg-red-50 text-red-700',
				confirmed: 'border-green-600 bg-green-50 text-green-700',
				unreviewed: 'border-yellow-700 bg-yellow-100 text-yellow-800'
			}
		},
		defaultVariants: { variant: 'missing' }
	});

</script>

<div {title}
		 class={cn(
			 "flex items-center px-2 py-1 border shrink-0 shadow-xs rounded-md w-fit overflow-hidden transition-all duration-500 ease-in-out hover:pr-2 group",
 statusBadgeVariants({variant})
 )}>
	<span class="size-3 rounded-full bg-current shrink-0"></span>
	<span class="font-semibold shrink-0 text-xs tracking-wider uppercase max-w-0 opacity-0 transition-all duration-300 @[10rem]:max-w-32 @[10rem]:opacity-100 @[10rem]:ml-1.5 ease-in-out group-hover:max-w-32 group-hover:opacity-100 group-hover:ml-1.5">{label}</span>
</div>