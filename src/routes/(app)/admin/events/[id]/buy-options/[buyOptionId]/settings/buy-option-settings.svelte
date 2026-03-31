<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import {
		activateBuyOption,
		deleteBuyOption,
		getBuyOptions,
		updateBuyOptionName
	} from '@/remote/functions/admin';
	import type { RemoteQuery } from '@sveltejs/kit';
	import * as Card from '@/components/ui/card';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { Save } from '@lucide/svelte';
	import { Input } from '@/components/ui/input';
	import Label from '@/components/ui/label/label.svelte';
	import { DeleteBuyOption } from '@/@svelte/modules';
	import * as Field from '@/components/ui/field';
	import * as Item from '@/components/ui/item';
	import { Root } from '@/@svelte/components';

	interface Props {
		eventId: string;
		buyOptionId: string;
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		version: number;
		name: string;
		active: boolean;
	}

	let buyOptionsFilter = $derived.by(() => ({
		eventId,
		page: 0,
		limit: 10,
		sortBy: 'creationDate',
		sortDirection: 'desc'
	}));
	let { eventId, buyOptionId, getBuyOptionQuery, version, name, active }: Props = $props();
</script>

<Card.Root>
	<form
		{...updateBuyOptionName.enhance(async ({ submit, data }) => {
			await submit().updates(
				getBuyOptionQuery.withOverride((prev) => {
					return {
						...prev,
						name: data.name,
						version: (prev.version ?? 0) + 1
					};
				}),
				getBuyOptions(buyOptionsFilter)
			);
		})}
	>
		<Card.Header>
			<Card.Title>{$_('components.editBuyOptions.generalInformation')}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Field.Set class="space-y-4">
				<input {...updateBuyOptionName.fields.buyOptionId.as('hidden', buyOptionId)} />
				<input {...updateBuyOptionName.fields.eventId.as('hidden', eventId)} />
				<input {...updateBuyOptionName.fields.version.as('number')} value={version} type="hidden" />
				<Field.Group>
					<Field.Field class="grid gap-2">
						<Field.Content>
							<Field.Label for="buyOptionName"
								>{$_('components.editBuyOptions.buyOptionName')}</Field.Label
							>
							<Field.Description>Der Name wird nur intern verwendet</Field.Description>
						</Field.Content>
						<div class="flex gap-2">
							<Input
								id="buyOptionName"
								{...updateBuyOptionName.fields.name.as('text')}
								class="grow"
								value={name}
							/>
							<Button type="submit">
								<Save class="mr-2 size-4" />
								{$_('common.save')}
							</Button>
						</div>
					</Field.Field>
					<Field.Separator />
					<Field.Field>
						<Field.Content>
							<Field.Label>{$_('components.editBuyOptions.buyOptionStatus')}</Field.Label>
							<Field.Description>
								{active
									? $_('components.editBuyOptions.buyOptionStatusActive')
									: $_('components.editBuyOptions.buyOptionStatusInactive')}
							</Field.Description>
						</Field.Content>
						<Item.Root variant="outline">
							<Item.Content>
								<Item.Title
									>{$_('admin-pages.events.buy-options.settings.activateBuyOption')}</Item.Title
								>
								<Item.Description>
									{$_('admin-pages.events.buy-options.settings.activateBuyOptionDescription')}
								</Item.Description>
							</Item.Content>
							<Item.Actions>
								<Button
									onclick={async () => {
										try {
											await activateBuyOption({
												buyOptionId,
												eventId
											});
											toast.success($_('modules.activate-buy-option.success'));
										} catch (e) {
											toast.error(e?.body?.message || $_('modules.activate-buy-option.error'));
										}
									}}
									disabled={active === true}
								>
									{$_('admin-pages.events.buy-options.publish')}
								</Button>
							</Item.Actions>
						</Item.Root>
					</Field.Field>
					<Field.Separator />
					<Field.Field>
						<Field.Content>
							<Field.Label>{$_('components.edit-buy-options.buy-option-version.label')}</Field.Label
							>
							<Field.Description
								>{$_(
									'components.edit-buy-options.buy-option-version.description'
								)}</Field.Description
							>
						</Field.Content>
						<div>{version}</div>
					</Field.Field>
					<Field.Separator />
					<Field.Field>
						<Field.Content>
							<Field.Label class="text-red-500"
								>{$_('components.edit-buy-options.danger-zone.title')}</Field.Label
							>
							<Field.Description
								>{$_('components.edit-buy-options.danger-zone.description')}</Field.Description
							>
						</Field.Content>
						<Item.Root variant="outline" class="bg-red-50 border-red-200">
							<Item.Content>
								<Item.Title>{$_('admin-pages.edit-buy-options.delete-buy-option.title')}</Item.Title
								>
								<Item.Description>
									{$_('admin-pages.edit-buy-options.delete-buy-option.description')}
								</Item.Description>
							</Item.Content>
							<Item.Actions>
								<DeleteBuyOption
									onDelete={async () => {
										try {
											await deleteBuyOption({
												buyOptionId,
												eventId
											});
											await goto(`/admin/events/${eventId}/buy-options`);
											toast.success($_('modules.delete-buy-option.success'));
										} catch (e) {
											toast.error(e?.body?.message || $_('modules.delete-buy-option.error'));
											throw e;
										}
									}}
								/>
							</Item.Actions>
						</Item.Root>
					</Field.Field>
				</Field.Group>
			</Field.Set>
		</Card.Content>
		<Card.Footer class="flex justify-end"></Card.Footer>
	</form>
</Card.Root>

<!-- Settings content goes here -->
