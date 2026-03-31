<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/item';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import type { VariantProps } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			description?: string;
			footer?: string;
			header?: string;
			button?: string;
			skeleton?: string;
		};
		title?: string;
		description?: string;
		instructions?: string;
		action?: VariantProps<typeof buttonVariants> & {
			fn: () => void;
			label: string | Snippet;
		};
		isPending?: boolean;
		disabled?: boolean;
		optimistic?: boolean;
	}

	let {
		className = '',
		classNames = {},
		title = '',
		description = '',
		action,
		isPending = false,
		disabled = false,
		optimistic = false
	}: Props = $props();
</script>

<Card.Root variant="outline" class={cn('w-full', className, classNames?.base)}>
	<Card.Content class={cn(classNames?.header)}>
		<div class="space-y-1.5">
			{#if title}
				<Card.Title>
					{title}
				</Card.Title>
			{/if}

			{#if description}
				<Card.Description>
					{description}
				</Card.Description>
			{/if}
		</div>
	</Card.Content>
	{#if action && action.label}
		<Card.Actions>
			<Button onclick={action.fn} {disabled} size={action.size} variant={action.variant}>
				{#if action.label instanceof Function}
					{@render action.label()}
				{:else}
					{action.label}
				{/if}
			</Button>
		</Card.Actions>
	{/if}
	{#if optimistic && isPending}
		<Card.Footer class={cn(classNames?.footer)}>
			<Skeleton class={cn('h-9 w-full', classNames?.skeleton)} />
		</Card.Footer>
	{/if}
</Card.Root>
