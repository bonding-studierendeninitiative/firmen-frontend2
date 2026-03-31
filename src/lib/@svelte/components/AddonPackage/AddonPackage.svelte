<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import { number } from '@services/i18n';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { TrashIcon } from '@/@svelte/icons';
	import { LoaderCircle } from '@lucide/svelte';
	import { _ } from '@services';

	interface Props {
		addonPackage: {
			id: string;
			title: string;
			description: string;
			label: string;
			price: number | null;
			addons: [
				{
					title: string;
					description: string;
					label: string;
					price: number | null;
				}
			];
		};
		onDelete: ({ addonPackageId }: { addonPackageId: string }) => Promise<void>;
	}

	let { addonPackage, onDelete }: Props = $props();
</script>

<Card.Root>
	<Card.Header class="gap-y-1 items-start">
		<div class="flex gap-x-2 flex-nowrap justify-between w-full items-center">
			<Card.Title>
				{addonPackage.title}
			</Card.Title>
			{#if addonPackage.price}
				<span>
					{$number((addonPackage.price ?? 0) / 100, {
						style: 'currency',
						currency: 'EUR',
						currencyDisplay: 'code'
					})}
				</span>
			{/if}
		</div>
		{#if addonPackage.label}
			<Badge>{addonPackage.label}</Badge>
		{/if}
		{#if addonPackage.description}
			<Card.Description>{addonPackage.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content class="space-y-1">
		<p class="text-xs font-semibold">{$_('components.addonPackage.addons')}</p>
		{#each addonPackage.addons as addon}
			<div class="flex gap-x-3 items-start justify-between">
				<span class="text-sm">{addon.title} </span>
				{#if addon.label}
					<Badge>{addon.label}</Badge>
				{/if}
				<div class="grow"></div>
				{#if addon.price}
					<span>
						{$number(addon.price / 100, {
							style: 'currency',
							currency: 'EUR',
							currencyDisplay: 'code'
						})}
					</span>
				{/if}
			</div>
			{#if addon.description}
				<p>{addon.description}</p>
			{/if}
		{/each}
	</Card.Content>
	<Card.Footer>
		<Button
			class="text-red-500 hover:text-red-700"
			disabled={!!$effect.pending()}
			variant="ghost"
			onclick={async () => {
				{
					await onDelete({ addonPackageId: addonPackage.id });
				}
			}}
		>
			{#if !!$effect.pending()}
				<LoaderCircle class="size-4 animate-spin" />
			{:else}
				<TrashIcon />
			{/if}
		</Button>
	</Card.Footer>
</Card.Root>
