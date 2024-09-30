import { type VariantProps, tv } from 'tailwind-variants';
import Root from './Link.svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

const linkVariants = tv({
	base: ' text-brand no-underline font-normal text-sm ',
	variants: {
		variant: {
			default: 'text-primary underline-offset-4 hover:underline',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			gradient:
				'relative px-4 py-2.5 space-x-4 rounded-lg text-white font-semibold bg-gradient-to-b from-white/30 to-transparent bg-brand '
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

type Variant = VariantProps<typeof linkVariants>['variant'];

type Props = HTMLAnchorAttributes & {
	variant?: Variant;
};

export {
	Root,
	type Props,
	//
	Root as Link,
	linkVariants
};
