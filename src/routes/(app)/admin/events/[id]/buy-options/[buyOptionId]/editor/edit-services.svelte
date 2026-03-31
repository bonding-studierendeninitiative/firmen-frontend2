<script lang="ts">
	import { _ } from '@services';
	import { updateBuyOptionService } from '@/remote/functions/admin';
	import * as Dialog from '@/components/ui/dialog';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Eye } from '@lucide/svelte';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import type { RemoteQuery } from '@sveltejs/kit';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import Textarea from '@/components/ui/textarea/textarea.svelte';

	interface Props {
		eventId: string;
		buyOptionId: string;
		service: Exclude<GetEventBuyOptionOutput['services'], undefined>[number];
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		version: number;
	}

	let { eventId, buyOptionId, service, getBuyOptionQuery, version }: Props = $props();
	let editForm = updateBuyOptionService.for(service.id!);

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} type="button">
		<Eye class="size-4" />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[500px]">
		<form
			{...editForm.enhance(async ({ data, form, submit }) => {
				await submit().updates(
					getBuyOptionQuery.withOverride((prev) => {
						return {
							...prev,
							services: prev.services?.map((s) => {
								if (s.id === data.serviceId) {
									return {
										...s,
										name: data.name,
										description: data.description,
										valueType: data.valueType
									};
								}
								return s;
							}),
							version: (prev.version ?? 0) + 1
						};
					})
				);
				if (editForm.result?.id) {
					form.reset();
					open = false;
				}
			})}
		>
			<input {...editForm.fields.eventId.as('hidden', eventId)} />
			<input {...editForm.fields.buyOptionId.as('hidden', buyOptionId)} />
			<input {...editForm.fields.version.as('number')} value={version} type="hidden" />
			<input {...editForm.fields.serviceId.as('hidden', service.id!)} />
			<Dialog.Header>
				<Dialog.Title>{$_('components.editBuyOptions.editService')}</Dialog.Title>
				<Dialog.Description>{$_('components.editBuyOptions.serviceDescription')}</Dialog.Description
				>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="serviceName">{$_('components.editBuyOptions.serviceName')}</Label>
					<Input id="serviceName" {...editForm.fields.name.as('text')} value={service.name} />
				</div>
				<div class="grid gap-2">
					<Label for="serviceDescription"
						>{$_('components.editBuyOptions.serviceDescription')}</Label
					>
					<Textarea
						id="serviceDescription"
						{...editForm.fields.description.as('text')}
						value={service.description}
					/>
				</div>
				<div>
					<Label>{$_('components.editBuyOptions.type')}</Label>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								{@const valueType = editForm.fields.valueType.value() ?? service.valueType}
								<Button class="my-2! p-2" variant="outline" {...props}>
									{#if valueType === 'STRING'}
										Textfeld für generische Werte
									{:else if valueType === 'BOOLEAN'}
										Enthalten (ja/nein)
									{:else if valueType === 'INTEGER'}
										Anzahl (z. B. 2 Stühle)
									{/if}
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<input
							{...editForm.fields.valueType.as(
								'hidden',
								editForm.fields.valueType.value() ?? service.valueType ?? 'STRING'
							)}
						/>
						<DropdownMenu.Content>
							<DropdownMenu.RadioGroup
								bind:value={
									() => editForm.fields.valueType.value() ?? service.valueType ?? 'STRING',
									editForm.fields.valueType.set
								}
							>
								<DropdownMenu.RadioItem value="STRING"
									>{$_('components.editBuyOptions.typeText')}</DropdownMenu.RadioItem
								>
								<DropdownMenu.RadioItem value="BOOLEAN"
									>{$_('components.editBuyOptions.typeBoolean')}</DropdownMenu.RadioItem
								>
								<DropdownMenu.RadioItem value="INTEGER"
									>{$_('components.editBuyOptions.typeNumeric')}</DropdownMenu.RadioItem
								>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}
					>{$_('common.cancel')}</Dialog.Close
				>
				<Button type="submit">{$_('common.save')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
