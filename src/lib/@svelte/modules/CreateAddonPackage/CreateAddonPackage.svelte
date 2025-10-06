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
		createAddonPackage.input![`addonPackage.addons[${addons}].title`] = '';
		createAddonPackage.input![`addonPackage.addons[${addons}].description`] = '';
		createAddonPackage.input![`addonPackage.addons[${addons}].price`] = '0';
		createAddonPackage.input![`addonPackage.addons[${addons}].label`] = '';
		addons += 1;
	};
	const handleRemoveAddon = (e: Event, index: number) => {
		e.preventDefault();
		let subAddonsCopy = [];
		for (let i = 0; i < addons; i++) {
			subAddonsCopy.push({
				title: createAddonPackage.input?.[`addonPackage.addons[${i}].title`] || '',
				description: createAddonPackage.input?.[`addonPackage.addons[${i}].description`] || '',
				price: Number(createAddonPackage.input?.[`addonPackage.addons[${i}].price`] || '0'),
				label: createAddonPackage.input?.[`addonPackage.addons[${i}].label`] || ''
			});
			delete createAddonPackage.input![`addonPackage.addons[${i}].title`];
			delete createAddonPackage.input![`addonPackage.addons[${i}].description`];
			delete createAddonPackage.input![`addonPackage.addons[${i}].price`];
			delete createAddonPackage.input![`addonPackage.addons[${i}].label`];
		}
		subAddonsCopy.splice(index, 1);
		subAddonsCopy.forEach((addon, i) => {
			createAddonPackage.input![`addonPackage.addons[${i}].title`] = addon.title;
			createAddonPackage.input![`addonPackage.addons[${i}].description`] = addon.description;
			createAddonPackage.input![`addonPackage.addons[${i}].price`] = String(addon.price);
			createAddonPackage.input![`addonPackage.addons[${i}].label`] = addon.label;
		});
		addons = Math.max(0, addons - 1);
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
		if (!isOpen && createAddonPackage.input) {
			createAddonPackage.input['addonPackage.title'] = '';
			createAddonPackage.input['addonPackage.label'] = '';
			createAddonPackage.input['addonPackage.description'] = '';
			createAddonPackage.input['addonPackage.price'] = '';
			createAddonPackage.input['addonPackage.purchasable'] = 'off';
		}
	});

	let addons = $state(0);
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
				<input type="hidden" name={createAddonPackage.field('eventId')} value={page.params.id!} />
				<input
					type="hidden"
					name={createAddonPackage.field('buyOptionId')}
					value={page.params.buyOptionId!}
				/>
				<div class="-m-2 px-4 py-2 h-max flex flex-col gap-4 @lg:grid @lg:grid-cols-3">
					<div class="@lg:col-span-2">
						<Label>{$_('admin-pages.addons.addonName')}</Label>
						<Input required name={createAddonPackage.field('addonPackage.title')} />
						{#if createAddonPackage.issues?.['addonPackage.title']}
							{#each createAddonPackage.issues['addonPackage.title'] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						{/if}
					</div>
					<div class="@lg:col-span-1">
						<Label>{$_('admin-pages.addons.label')}</Label>
						<Input name={createAddonPackage.field('addonPackage.label')} />
						{#if createAddonPackage.issues?.['addonPackage.label']}
							{#each createAddonPackage.issues['addonPackage.label'] as issue}
								<div class="text-red-500">{issue.message}</div>
							{/each}
						{/if}
					</div>
					<div class="@lg:col-span-2">
						<Label>{$_('admin-pages.addons.packageInformation')}</Label>
						<Textarea name={createAddonPackage.field('addonPackage.description')} />
						{#if createAddonPackage.issues?.['addonPackage.description']}
							{#each createAddonPackage.issues['addonPackage.description'] as issue}
								<div class="text-red-500">{issue.message}</div>
							{/each}
						{/if}
					</div>
					<Checkbox
						containerClass="col-span-1"
						bind:checked={
							() => {
								return createAddonPackage.input?.['addonPackage.purchasable'] === 'on';
							},
							(v) => {
								createAddonPackage.input!['addonPackage.purchasable'] = v ? 'on' : 'off';
							}
						}
						label={$_('admin-pages.addons.purchasable')}
					>
						<div class="text-gray">{$_('admin-pages.addons.purchasableDescription')}</div>
						{#snippet description()}
							<Input
								type="number"
								required={!createAddonPackage.input ||
									createAddonPackage.input['addonPackage.purchasable'] === 'on'}
								disabled={createAddonPackage.input?.['addonPackage.purchasable'] !== 'on'}
								name={createAddonPackage.field('addonPackage.price')}
								placeholder={$_('admin-pages.addons.pricePlaceholder')}
							/>
							{#if createAddonPackage.issues?.['addonPackage.price']}
								{#each createAddonPackage.issues['addonPackage.price'] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							{/if}
						{/snippet}
					</Checkbox>
					<section class="col-span-3">
						<fieldset class="border border-stone-300 rounded-lg p-4">
							<legend class="px-2 text-sm font-semibold">{$_('common.addons')}</legend>
							<div class="space-y-2">
								{#each Array.from({ length: addons }) as _unused, index}
									<div class={`p-2 relative grid grid-cols-2 gap-4 w-full`}>
										<button
											class="absolute right-3 top-4 text-red-500 hover:text-red-700 text-xs"
											onclick={(e) => handleRemoveAddon(e, index)}
										>
											<TrashIcon />
										</button>

										<Label>{$_('admin-pages.addons.subAddonName')}</Label>
										<Input name={createAddonPackage.field(`addonPackage.addons[${index}].title`)} />
										{#if createAddonPackage.issues?.[`addonPackage.addons[${index}].title`]}
											{#each createAddonPackage.issues[`addonPackage.addons[${index}].title`] as issue}
												<div class="text-red-500 text-sm">{issue.message}</div>
											{/each}
										{/if}

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
									{#if index < addons - 1}
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
				<SuperDebug data={{ input: createAddonPackage.input, issues: createAddonPackage.issues }} />
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
