<script lang="ts">
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/@svelte/components';
	import { Separator } from '@/components/ui/separator';
	import { Input } from '@/components/ui/input';
	import { PlusIcon, TrashIcon } from '@/@svelte/icons';
	import { _ } from '@services/i18n';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import SuperDebug from 'sveltekit-superforms';
	import { type CreateEventAddonPackageFormSchema } from '@schema/eventAddonPackages';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { createAddonPackage } from '@/remote/functions/admin';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import type { InferInput } from 'valibot';
	import { Label } from '@/components/ui/label';
	import { page } from '$app/state';

	const handleAddSubAddon = (e: Event) => {
		e.preventDefault();
		createAddonPackage.fields.addonPackage.addons.set([
			...createAddonPackage.fields.addonPackage.addons.value(),
			{
				title: '',
				price: '0',
				description: '',
				label: ''
			}
		]);
	};
	const handleRemoveAddon = (e: Event, index: number) => {
		e.preventDefault();
		let addons = createAddonPackage.fields.addonPackage.addons;
		addons.set(addons.value().filter((_, i) => i !== index));
	};

	interface Props {
		isOpen?: boolean;
		onCreateAddonPackage?: ({
			submit,
			form,
			data
		}: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: InferInput<CreateEventAddonPackageFormSchema>;
		}) => Promise<void>;
	}

	let { isOpen = $bindable(false), onCreateAddonPackage }: Props = $props();

	$effect(() => {
		if (!isOpen && createAddonPackage.fields.addonPackage.value()) {
			createAddonPackage.fields.addonPackage.title.set('');
			createAddonPackage.fields.addonPackage.label.set('');
			createAddonPackage.fields.addonPackage.description.set('');
			createAddonPackage.fields.addonPackage.price.set(0);
			createAddonPackage.fields.addonPackage.purchasable.set(false);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<Button variant="link">{$_('admin-pages.addons.add')}</Button>
	</Dialog.Trigger>
	<Dialog.Content class="flex flex-col gap-y-4 max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>{$_('admin-pages.addons.title')}</Dialog.Title>
		</Dialog.Header>
		<Separator />
		<form
			oninput={() => createAddonPackage.validate()}
			class="@container"
			{...createAddonPackage.enhance(async ({ data, form, submit }) => {
				// formData.set({ ...$formData, ...Object.fromEntries(data) });

				try {
					console.log(data);
					await onCreateAddonPackage?.({ submit, form, data });
					console.log('submitted');

					isOpen = false;
				} catch (error) {
					console.error(error);
				}
			})}
		>
			<ScrollArea class="h-[60dvh]">
				<input {...createAddonPackage.fields.eventId.as('hidden', page.params.id!)} />
				<input {...createAddonPackage.fields.buyOptionId.as('hidden', page.params.buyOptionId!)} />
				<div class="-m-2 px-4 py-2 h-max flex flex-col gap-4 @lg:grid @lg:grid-cols-3">
					<div class="@lg:col-span-2">
						<Label>{$_('admin-pages.addons.addonName')}</Label>
						<Input {...createAddonPackage.fields.addonPackage.title.as('text')} required />
						{#each createAddonPackage.fields.addonPackage.title.issues() as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</div>
					<div class="@lg:col-span-1">
						<Label>{$_('admin-pages.addons.label')}</Label>
						<Input {...createAddonPackage.fields.addonPackage.label.as('text')} />

						{#each createAddonPackage.fields.addonPackage.label.issues() as issue}
							<div class="text-red-500">{issue.message}</div>
						{/each}
					</div>
					<div class="@lg:col-span-2">
						<Label>{$_('admin-pages.addons.packageInformation')}</Label>
						<Textarea {...createAddonPackage.fields.addonPackage.description.as('text')} />
						{#if createAddonPackage.fields.addonPackage.description.issues()}
							{#each createAddonPackage.fields.addonPackage.description.issues() as issue}
								<div class="text-red-500">{issue.message}</div>
							{/each}
						{/if}
					</div>
					<Checkbox
						containerClass="col-span-1"
						{...createAddonPackage.fields.addonPackage.purchasable.as('checkbox')}
						label={$_('admin-pages.addons.purchasable')}
					>
						<div class="text-gray">{$_('admin-pages.addons.purchasableDescription')}</div>
						{#snippet description()}
							<Input
								required={!createAddonPackage.fields.addonPackage.purchasable.value() ||
									createAddonPackage.fields.addonPackage.purchasable.value() === true}
								disabled={createAddonPackage.fields.addonPackage.purchasable.value() !== true}
								{...createAddonPackage.fields.addonPackage.price.as('number')}
								placeholder={$_('admin-pages.addons.pricePlaceholder')}
							/>
							{#each createAddonPackage.fields.addonPackage.price.issues() as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						{/snippet}
					</Checkbox>
					<section class="col-span-3">
						<fieldset class="border border-stone-300 rounded-lg p-4">
							<legend class="px-2 text-sm font-semibold">{$_('common.addons')}</legend>
							<div class="space-y-2">
								{#each createAddonPackage.fields.addonPackage.addons.value() as _unused, index}
									<div class={`p-2 relative grid grid-cols-2 gap-4 w-full`}>
										<button
											class="absolute right-3 top-4 text-red-500 hover:text-red-700 text-xs"
											onclick={(e) => handleRemoveAddon(e, index)}
										>
											<TrashIcon />
										</button>

										<Label>{$_('admin-pages.addons.subAddonName')}</Label>
										<Input
											{...createAddonPackage.fields.addonPackage.addons[index].title.as('text')}
										/>
										{#each createAddonPackage.fields.addonPackage.addons[index].title.issues() as issue}
											<div class="text-red-500 text-sm">{issue.message}</div>
										{/each}

										<Label>{$_('admin-pages.addons.price')}</Label>
										<input
											class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											type="number"
											name={`addonPackage.addons[${index}].price`}
										/>

										<Label>{$_('admin-pages.addons.subAddonDescription')}</Label>
										<Input name={`addonPackage.addons[${index}].description`} />

										<Label>{$_('admin-pages.addons.label')}</Label>
										<Input name={`addonPackage.addons[${index}].label`} />
									</div>
									{#if index < createAddonPackage.fields.addonPackage.addons.value().length - 1}
										<Separator class="-mx-4 mr-auto" />
									{/if}
								{/each}
							</div>
							<Button variant="link" class="font-semibold!" onclick={handleAddSubAddon}>
								<PlusIcon classes="mr-2" />{$_('admin-pages.addons.addSubAddon')}
							</Button>
						</fieldset>
					</section>
				</div>
				<SuperDebug
					data={{
						form: createAddonPackage.fields.value(),
						issues: createAddonPackage.fields.allIssues()
					}}
				/>
				<Button variant="default" type="submit">{$_('common.save')}</Button>
			</ScrollArea>
		</form>
		<Dialog.Footer class="flex justify-end items-center gap-x-2 col-span-3">
			<Button
				variant="secondary"
				onclick={() => {
					isOpen = false;
				}}
				>{$_('common.cancel')}
			</Button>
			<Button {...createAddonPackage.buttonProps} variant="default" type="submit"
				>{$_('common.save')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
