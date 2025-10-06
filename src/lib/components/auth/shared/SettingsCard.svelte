<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			description?: string;
			footer?: string;
			header?: string;
			title?: string;
			instructions?: string;
			button?: string;
			skeleton?: string;
		};
		title?: string;
		description?: string;
		instructions?: string;
		actionLabel?: string;
		action?: () => void;
		isPending?: boolean;
		disabled?: boolean;
		optimistic?: boolean;
		children?: any;
	}

	let {
		className = '',
		classNames = {},
		title = '',
		description = '',
		instructions = '',
		actionLabel = '',
		action,
		isPending = false,
		disabled = false,
		optimistic = false,
		children
	}: Props = $props();
</script>

<Card.Root class={cn('w-full', className, classNames?.base)}>
	<Card.Header class={cn('grid grid-cols-[1fr_auto] items-start gap-4', classNames?.header)}>
		<div class="space-y-1.5">
			{#if title}
				<Card.Title class={cn('text-lg', classNames?.title)}>
					{title}
				</Card.Title>
			{/if}

			{#if description}
				<Card.Description class={cn('text-sm text-muted-foreground', classNames?.description)}>
					{description}
				</Card.Description>
			{/if}

			{#if instructions}
				<p class={cn('text-xs text-muted-foreground', classNames?.instructions)}>
					{instructions}
				</p>
			{/if}
		</div>

		{#if actionLabel && action}
			<Button onclick={action} {disabled} class={cn('shrink-0', classNames?.button)}>
				{actionLabel}
			</Button>
		{/if}
	</Card.Header>

	{#if isPending && !children}
		<Card.Content class={classNames?.content}>
			<Skeleton class={cn('h-9 w-full', classNames?.skeleton)} />
		</Card.Content>
	{:else if children}
		{@render children()}
	{/if}
	<Card.Footer></Card.Footer>
</Card.Root>
