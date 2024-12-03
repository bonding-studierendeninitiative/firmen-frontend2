<script lang="ts">
	import { cn } from '@/utils';
	import { tv, type VariantProps } from 'tailwind-variants';

	export let status: string;
	export let variant: ChipVariant;
	export let classes: string = '';

	type ChipVariant = VariantProps<typeof chipVariants>['variant'];

	const chipVariants= tv({
		base: "rounded-custom w-auto px-[10px] py-[2px] text-sm font-normal text-center",
		variants: {
			variant: {
			success: "text-green-600 bg-green-50",
			confirmed: "text-green-600 bg-green-50",
			info: "text-orange-500 bg-orange-100",
			verification: "text-orange-500 bg-orange-100",
			created: "text-orange-500 bg-orange-100",
			rejected: "text-red-500 bg-red-100",
			withdrawn: "text-red-500 bg-red-100",
			brand: "text-brand bg-brand bg-opacity-5",
			},
		},
	});
</script>

<p
	class={cn(
		chipVariants({ variant, className: classes }),
	)}
>
	{status}
</p>
