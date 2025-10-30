<script lang="ts">
	import { _ } from '@services';
	import { updateBuyOptionPackage } from '@/remote/functions/admin';
	import * as Dialog from '@/components/ui/dialog';
	import { Eye } from '@lucide/svelte';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import type { RemoteQuery } from '@sveltejs/kit';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Field from '@/components/ui/field';
	import { cn } from '@/utils';

	interface Props {
		eventId: string;
		buyOptionId: string;
		pkg: Exclude<GetEventBuyOptionOutput['packages'], undefined>[number];
		getBuyOptionQuery: RemoteQuery<GetEventBuyOptionOutput>;
		version: number;
	}

	let { eventId, buyOptionId, pkg, getBuyOptionQuery, version }: Props = $props();
	let editForm = updateBuyOptionPackage.for(pkg.id!);

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
							packages: prev.packages?.map((p) => {
								if (p.id === pkg.id) {
									return {
										...p,
										name: data.name,
										price: Number(data.price)
									};
								}
								return p;
							}),
							version: (prev.version ?? 0) + 1
						};
					})
				);
				form.reset();
				open = false;
			})}
		>
			<input {...editForm.fields.eventId.as('hidden', eventId)} />
			<input {...editForm.fields.buyOptionId.as('hidden', buyOptionId)} />
			<input {...editForm.fields.packageId.as('hidden', pkg.id!)} />
			<input {...editForm.fields.version.as('number')} value={version} type="hidden" />
			<Dialog.Header>
				<Dialog.Title>{$_('components.editBuyOptions.editPackage')}</Dialog.Title>
				<Dialog.Description
					>{$_('components.editBuyOptions.editPackageDescription')}</Dialog.Description
				>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Field.Set>
					<Field.Error>
						{#each editForm.fields.allIssues() as issue (issue.message)}
							<p class="text-sm text-destructive">{issue.message}</p>
						{/each}
					</Field.Error>
					<Field.Field>
						<Field.Label for="packageName"
							>{$_('components.editBuyOptions.packageName')}</Field.Label
						>
						<Input id="packageName" {...editForm.fields.name.as('text')} value={pkg.name} />
					</Field.Field>
					<Field.Field>
						<Field.Label for="packagePrice"
							>{$_('components.editBuyOptions.packagePrice')}</Field.Label
						>
						<Input id="packagePrice" {...editForm.fields.price.as('number')} value={pkg.price} />
					</Field.Field>
				</Field.Set>
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
