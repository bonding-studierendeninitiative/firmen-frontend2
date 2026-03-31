<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Empty from '@/components/ui/empty';

	interface Props {
		heading?: string;
		subHeading?: string;
		action?:
			| {
					label: string;
					onclick: () => void;
			  }
			| {
					label: string;
					href: string;
			  };
	}

	let { heading = '', subHeading = '', action }: Props = $props();
</script>

<Empty.Root class="bg-muted border border-dashed border-border">
	<Empty.Header>
		<Empty.Title>{heading}</Empty.Title>
		<Empty.Description>{subHeading}</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		{#if action && 'onclick' in action}
			<Button variant="default" onclick={action.onclick}>{action.label}</Button>
		{:else if action && 'href' in action}
			<Button variant="link">
				<a href={action.href}>
					{action.label}
				</a>
			</Button>
		{/if}
	</Empty.Content>
</Empty.Root>
