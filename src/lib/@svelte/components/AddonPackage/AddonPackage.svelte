<script lang="ts">

	import { Badge } from '@/components/ui/badge';
	import { number } from '@services/i18n';
	import * as Card from '@/components/ui/card';

	export let addonPackage: {
		title: string;
		description: string;
		label: string;
		price: number | null;
	};
</script>

<Card.Root>
	<Card.Header class="gap-y-2 items-start">
		<Card.Title>
			{addonPackage.title}
		</Card.Title>
		<div class="flex gap-x-2">
			<Badge>{addonPackage.label}</Badge>
			{#if addonPackage.price}
				<Badge>
					{$number((addonPackage.price ?? 0) / 100, {
						style: "currency",
						currency: "EUR",
						currencyDisplay: "code"
					})}
				</Badge>
			{/if}
		</div>
		{#if addonPackage.description}
			<Card.Description>{addonPackage.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>

	</Card.Content>
</Card.Root>