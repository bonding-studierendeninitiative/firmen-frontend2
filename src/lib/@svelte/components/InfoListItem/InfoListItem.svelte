<script lang="ts">
	import { Event } from '@/@svelte/components/Event';
	import { Button } from '@/components/ui/button';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { _ } from '@services';

	type Props = {
		heading: string;
		subHeading: string | undefined;
		date: string | null;
		onBuyOptionsClick?: (() => void) | undefined;
	} & (
		| { showButton: true; buttonText: string; onRegisterClick: () => void }
		| { showButton: false; buttonText?: undefined; onRegisterClick?: undefined }
	);

	let {
		showButton,
		heading,
		subHeading,
		date,
		buttonText,
		onRegisterClick,
		onBuyOptionsClick = undefined
	}: Props = $props();
</script>

<div class=" p-4 shadow-custom rounded-md border border-card bg-card">
	<div class=" flex justify-end gap-x-2 items-center">
		<Event loading={false} event={{ dateFrom: date, location: subHeading, name: heading }} />
		<div class="grow"></div>
		{#if showButton}
			<Button size="sm" variant="secondary" class="py-1.5!" onclick={() => onRegisterClick?.()}>
				{buttonText}
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="ghost" size="icon" class="relative size-8 p-0" {...props}>
							<span class="sr-only">{$_('common.open-menu')}</span>
							<Ellipsis class="size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{heading}</DropdownMenu.Label>
						<DropdownMenu.Item onclick={() => onBuyOptionsClick?.()}>
							{$_('admin-pages.events.show-buy-options')}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</div>
