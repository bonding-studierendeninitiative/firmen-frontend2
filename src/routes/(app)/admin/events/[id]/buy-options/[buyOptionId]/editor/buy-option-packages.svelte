<script lang="ts">
	import { _, number } from '@services';
	import { Plus, Trash2, ArrowUp, ArrowDown } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Card from '@/components/ui/card';
	import * as Dialog from '@/components/ui/dialog';
	import * as Field from '@/components/ui/field';
	import {
		createBuyOptionPackage,
		deleteBuyOptionPackage,
		moveBuyOptionPackage
	} from '@/remote/functions/admin';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import { cn } from '@/utils';
	import EditPackage from './edit-package.svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		eventId: string;
		buyOptionId: string;
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		packages: GetEventBuyOptionOutput['packages'];
		version: number;
		movePackage?: (packageId: string, direction: 'up' | 'down', version: number) => Promise<void>;
	}
	let { eventId, buyOptionId, getBuyOptionQuery, packages, version, movePackage }: Props = $props();

	async function removePackage(packageId: string) {
		console.log('Removing package with ID:', packageId);
		await deleteBuyOptionPackage({
			eventId,
			buyOptionId,
			packageId,
			version
		}).updates(
			getBuyOptionQuery.withOverride((prev) => {
				return {
					...prev,
					packages: prev.packages?.filter((pkg) => pkg.id !== packageId) || [],
					version: (prev.version ?? 0) + 1
				};
			})
		);
	}

	let createOpen = $state(false);
</script>

<!-- Packages Management -->
<Card.Root class="col-span-2 @3xl/buy-option-editor:col-span-1">
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{$_('components.editBuyOptions.packages')}</Card.Title>
		<Dialog.Root bind:open={createOpen}>
			<Dialog.Trigger class={cn(buttonVariants({ variant: 'default', size: 'sm' }))} type="button">
				<Plus class="mr-2 size-4" />
				{$_('components.editBuyOptions.addPackage')}
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[500px]">
				<form
					{...createBuyOptionPackage.enhance(async ({ data, form, submit }) => {
						await submit().updates(
							getBuyOptionQuery.withOverride((prev) => {
								return {
									...prev,
									packages: [
										...(prev.packages ?? []),
										{
											id: crypto.randomUUID(),
											name: data.name,
											price: Number(data.price)
										}
									],
									version: (prev.version ?? 0) + 1
								};
							})
						);
						if (createBuyOptionPackage.result?.id) {
							toast.success('Package created successfully');
							form.reset();
							createOpen = false;
						}
					})}
				>
					<input {...createBuyOptionPackage.fields.eventId.as('hidden', eventId)} />
					<input {...createBuyOptionPackage.fields.buyOptionId.as('hidden', buyOptionId)} />
					<input
						{...createBuyOptionPackage.fields.version.as('number')}
						value={version}
						type="hidden"
					/>
					<Dialog.Header>
						<Dialog.Title>{$_('components.editBuyOptions.editPackage')}</Dialog.Title>
						<Dialog.Description
							>{$_('components.editBuyOptions.editPackageDescription')}</Dialog.Description
						>
					</Dialog.Header>
					<Field.Set>
						<Field.Error>
							{#each createBuyOptionPackage.fields.allIssues() as issue (issue.message)}
								<p class="text-sm text-destructive">{issue.message}</p>
							{/each}
						</Field.Error>
						<Field.Group>
							<Field.Field
								data-invalid={Number(createBuyOptionPackage.fields.name.issues()?.length) > 0}
							>
								<Field.Label for="packageName"
									>{$_('components.editBuyOptions.packageName')}</Field.Label
								>
								<Input
									id="packageName"
									{...createBuyOptionPackage.fields.name.as('text')}
									bind:value={
										createBuyOptionPackage.fields.name.value, createBuyOptionPackage.fields.name.set
									}
								/>
								<Field.Error>
									{#each createBuyOptionPackage.fields.name.issues() as issue (issue.message)}
										<p class="text-sm text-destructive">{issue.message}</p>
									{/each}
								</Field.Error>
							</Field.Field>
							<Field.Field>
								<Field.Label for="packagePrice"
									>{$_('components.editBuyOptions.packagePrice')}</Field.Label
								>
								<Input
									id="packagePrice"
									{...createBuyOptionPackage.fields.price.as('number')}
									min={0}
									bind:value={
										createBuyOptionPackage.fields.price.value,
										createBuyOptionPackage.fields.price.set
									}
								/>
								<Field.Error>
									{#each createBuyOptionPackage.fields.price.issues() as issue (issue.message)}
										<p class="text-sm text-destructive">{issue.message}</p>
									{/each}
								</Field.Error>
							</Field.Field>
						</Field.Group>
					</Field.Set>
					<Dialog.Footer>
						<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}
							>{$_('common.cancel')}</Dialog.Close
						>
						<Button type="submit">{$_('common.save')}</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Header>
	<Card.Content>
		<div class="space-y-4">
			{#each packages ?? [] as pkg (pkg.id)}
				<div class="flex items-center justify-between p-2 border rounded-md">
					<div>
						<p class="font-medium">{pkg.name}</p>
						<p class="text-sm text-muted-foreground">
							{$number((pkg.price ?? 0) / 100, {
								style: 'currency',
								currency: 'EUR',
								currencyDisplay: 'code'
							})}
						</p>
					</div>
					<div class="flex gap-1">
						<Button
							variant="ghost"
							size="icon"
							disabled={pkg.id === (packages?.[0]?.id ?? null)}
							onclick={() => movePackage?.(pkg.id!, 'up', version)}
						>
							<ArrowUp class="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={pkg.id === (packages?.[packages.length - 1]?.id ?? null)}
							onclick={() => movePackage?.(pkg.id!, 'down', version)}
						>
							<ArrowDown class="size-4" />
						</Button>
						<EditPackage {pkg} {eventId} {buyOptionId} {version} {getBuyOptionQuery} />
						<Button variant="ghost" size="icon" onclick={() => removePackage(pkg.id!)}>
							<Trash2 class="size-4 text-destructive" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
