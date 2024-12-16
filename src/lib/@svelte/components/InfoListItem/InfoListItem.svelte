<script lang="ts">
	import { Event } from '@/@svelte/components/Event';
	import { Button } from '@/components/ui/button';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { _ } from '@services';

	export let showButton = true;
	export let heading: string;
	export let subHeading: string | undefined;
	export let date: string | null;
	export let buttonText: string;
	export let onRegisterClick: (() => void) | undefined = undefined;
	export let onBuyOptionsClick: (() => void) | undefined = undefined;
</script>

<div class=" p-4 shadow-custom rounded-md border border-solid border-stone-200">
	<div class=" flex justify-end items-start gap-x-2">
		<Event event={{ dateFrom: date, location: subHeading, name: heading }} />
		<div class="flex-grow"></div>
		{#if showButton}
			<Button size="sm" variant="secondary" class="!py-1.5" on:click={() => onRegisterClick?.()}>
				{buttonText}
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
						<span class="sr-only">{$_("common.open-menu")}</span>
						<Ellipsis class="h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{heading}</DropdownMenu.Label>
						<DropdownMenu.Item on:click={() => onBuyOptionsClick?.()}>
							{$_("admin-pages.events.show-buy-options")}
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</div>
