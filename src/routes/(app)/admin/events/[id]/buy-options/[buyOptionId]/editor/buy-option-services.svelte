<script lang="ts">
	import { _ } from '@services';
	import { Plus, Trash2, ArrowUp, ArrowDown } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Card from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import {
		createBuyOptionService,
		deleteBuyOptionService,
		moveBuyOptionService,
		updateBuyOptionService
	} from '@/remote/functions/admin';
	import { Label } from '@/components/ui/label';
	import { Textarea } from '@/components/ui/textarea';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { cn } from '@/utils';
	import EditServices from './edit-services.svelte';

	interface Props {
		eventId: string;
		buyOptionId: string;
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		version: number;
		services: GetEventBuyOptionOutput['services'];
		moveService?: (serviceId: string, direction: 'up' | 'down', version: number) => Promise<void>;
	}
	let { eventId, buyOptionId, getBuyOptionQuery, version, services, moveService } = $props();

	async function removeService(serviceId: string) {
		await deleteBuyOptionService({
			eventId,
			buyOptionId,
			serviceId,
			version
		}).updates(
			getBuyOptionQuery.withOverride((prev) => {
				return {
					...prev,
					services: prev.services?.filter((svc) => svc.id !== serviceId),
					version: (prev.version ?? 0) + 1
				};
			})
		);
	}

	let createOpen = $state(false);
	let editOpen = $state(false);
</script>

<!-- Services Management -->
<Card.Root class="col-span-2 @3xl/buy-option-editor:col-span-1">
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{$_('components.editBuyOptions.services')}</Card.Title>
		<Dialog.Root bind:open={createOpen}>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'default', size: 'sm' }))} type="button">
				<Plus class="mr-2 size-4" />
				{$_('components.editBuyOptions.addService')}
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[500px]">
				<form
					{...createBuyOptionService.enhance(async ({ data, form, submit }) => {
						await submit().updates(
							getBuyOptionQuery.withOverride((prev) => {
								return {
									...prev,
									services: [
										...(prev.services ?? []),
										{
											id: crypto.randomUUID(),
											name: createBuyOptionService.fields.name.value(),
											description: createBuyOptionService.fields.description.value(),
											valueType: createBuyOptionService.fields.valueType.value()
										}
									],
									version: (prev.version ?? 0) + 1
								};
							})
						);
						if (createBuyOptionService.result?.id) {
							form.reset();
							createOpen = false;
						}
					})}
				>
					<input {...createBuyOptionService.fields.eventId.as('hidden', eventId)} />
					<input {...createBuyOptionService.fields.buyOptionId.as('hidden', buyOptionId)} />
					<input
						{...createBuyOptionService.fields.version.as('number')}
						value={version}
						type="hidden"
					/>
					<Dialog.Header>
						<Dialog.Title>{$_('components.editBuyOptions.add-service')}</Dialog.Title>
						<Dialog.Description
							>{$_('components.editBuyOptions.add-service-description')}</Dialog.Description
						>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid gap-2">
							<Label for="serviceName">{$_('components.editBuyOptions.serviceName')}</Label>
							<Input
								id="serviceName"
								{...createBuyOptionService.fields.name.as('text')}
								bind:value={
									createBuyOptionService.fields.name.value, createBuyOptionService.fields.name.set
								}
							/>
						</div>
						<div class="grid gap-2">
							<Label for="serviceDescription"
								>{$_('components.editBuyOptions.serviceDescription')}</Label
							>
							<Textarea
								id="serviceDescription"
								{...createBuyOptionService.fields.description.as('text')}
								bind:value={
									createBuyOptionService.fields.description.value,
									createBuyOptionService.fields.description.set
								}
							/>
						</div>
						<div>
							<Label>{$_('components.editBuyOptions.type')}</Label>
							<input {...createBuyOptionService.fields.valueType.as('text')} type="hidden" />
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button class="my-2! p-2" variant="outline" {...props}>
											{#if createBuyOptionService.fields.valueType.value() === 'STRING'}
												Textfeld für generische Werte
											{:else if createBuyOptionService.fields.valueType.value() === 'BOOLEAN'}
												Enthalten (ja/nein)
											{:else if createBuyOptionService.fields.valueType.value() === 'INTEGER'}
												Anzahl (z. B. 2 Stühle)
											{/if}
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.RadioGroup
										bind:value={
											() => createBuyOptionService.fields.valueType.value() ?? 'STRING',
											createBuyOptionService.fields.valueType.set
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
						<Dialog.Close class={buttonVariants({ variant: 'outline' })} type="button"
							>{$_('common.confirm')}</Dialog.Close
						>
						<Button type="submit">{$_('common.create')}</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Header>
	<Card.Content>
		<div class="space-y-4">
			{#each services ?? [] as service (service.id)}
				{@const editForm = updateBuyOptionService.for(service.id!)}
				<div class="flex items-center justify-between p-2 border rounded-md">
					<div>
						<p class="font-medium">{service.name}</p>
					</div>
					<div class="flex gap-1">
						<Button
							variant="ghost"
							size="icon"
							disabled={service.id === (services?.[0]?.id ?? null)}
							onclick={() => moveService?.(service.id!, 'up', version)}
						>
							<ArrowUp class="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={service.id === (services?.[services.length - 1]?.id ?? null)}
							onclick={() => moveService?.(service.id!, 'down', version)}
						>
							<ArrowDown class="size-4" />
						</Button>
						<EditServices {eventId} {buyOptionId} {service} {getBuyOptionQuery} {version} />

						<Button
							variant="ghost"
							type="button"
							size="icon"
							onclick={() => removeService(service.id!)}
						>
							<Trash2 class="size-4 text-destructive" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
