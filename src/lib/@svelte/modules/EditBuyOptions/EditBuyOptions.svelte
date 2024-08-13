<script lang="ts">
	import { _ } from '@services/i18n';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Checkbox, GradientButton, Link } from '$lib/@svelte/components';
	import { type UpdateBuyOptionsRequest, ValueType } from '@schema';
	import { TrashIcon } from '$lib/@svelte/icons';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Hash, Plus, Type } from 'lucide-svelte';
	import Check from 'lucide-svelte/icons/check';
	import { Field, Label, Control, Description, FieldErrors } from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import NumericInput from '@/@svelte/components/NumericInput/NumericInput.svelte';
	import { toast } from 'svelte-french-toast';

	export let form: SuperValidated<UpdateBuyOptionsRequest>;

	const superform = superForm<UpdateBuyOptionsRequest>(form,
		{
			dataType: 'json',
			invalidateAll: 'force',
			onResult({ result }) {
				if (result.type === 'success') {
					toast.success($_('user-pages.events.eventUpdatedSuccessfully'));
				} else if (result.type === 'error') {
					toast.error(result.error.message);
				}
			}
		});
	const { form: formData, enhance } = superform;

	const addBuyOption = (e: Event) => {
		e.preventDefault();
		formData.update((oldForm) => ({
			...oldForm,
			buyOptions: [
				...oldForm.buyOptions,
				{
					name: '',
					packages: [{
						name: '',
						price: 0,
						order: 0,
						benefits: [
							{
								numericValue: null,
								booleanValue: null,
								stringValue: null
							}
						]
					}],
					services: [{
						name: '',
						order: 0,
						description: '',
						valueType: ValueType.String
					}]
				}
			]
		}));
	};
	const removePackage = (e: Event, buyOptionIndex: number, packageIndex: number) => {
		e.preventDefault();
		formData.update((oldForm) => {
			const oldBuyOptions = [...oldForm.buyOptions];

			oldBuyOptions[buyOptionIndex] = {
				...oldBuyOptions[buyOptionIndex],
				packages: [
					...oldBuyOptions[buyOptionIndex].packages.slice(0, packageIndex),
					...oldBuyOptions[buyOptionIndex].packages.slice(packageIndex + 1)
				].map((_, index) => ({ ...oldBuyOptions[buyOptionIndex].packages[index], order: index }))
			};

			return ({
				...oldForm,
				buyOptions: [...oldBuyOptions]
			});
		});
	};
	const addPackage = (e: Event, buyOptionIndex: number) => {
		e.preventDefault();
		formData.update((oldForm) => {
			const oldBuyOptions = [...oldForm.buyOptions];

			oldBuyOptions[buyOptionIndex] = {
				...oldBuyOptions[buyOptionIndex],
				packages: [...oldBuyOptions[buyOptionIndex].packages, {
					name: '',
					price: 0,
					order: oldBuyOptions[buyOptionIndex].packages.length,
					benefits: new Array(oldBuyOptions[buyOptionIndex].services.length).fill({
						numericValue: null,
						booleanValue: null,
						stringValue: null
					})
				}]
			};

			return ({
				...oldForm,
				buyOptions: [...oldBuyOptions]
			});
		});
	};
	const addService = (e: Event, buyOptionIndex: number) => {
		e.preventDefault();
		formData.update((oldForm) => {
			const oldBuyOptions = [...oldForm.buyOptions];

			oldBuyOptions[buyOptionIndex] = {
				...oldBuyOptions[buyOptionIndex],
				services: [
					...oldBuyOptions[buyOptionIndex].services,
					{
						name: '',
						description: '',
						order: oldBuyOptions[buyOptionIndex].services.length,
						valueType: ValueType.String
					}
				],
				packages: oldBuyOptions[buyOptionIndex].packages.map((oldPackage) => ({
					...oldPackage,
					benefits: [
						...oldPackage.benefits,
						{
							numericValue: null,
							booleanValue: null,
							stringValue: null
						}
					]
				}))
			};

			return ({
				...oldForm,
				buyOptions: [...oldBuyOptions]
			});
		});
	};
</script>

<form class="flex flex-col gap-6 justify-center" action="?/updateBuyOption" method="post" use:enhance>
	{#if $formData.buyOptions }
		{#each $formData.buyOptions as _, index}
			<div class={' min-w-full overflow-x-scroll rounded-lg shadow-xs border border-stone-200 '}>
				<div class="min-w-full overflow-x-auto">
					<table class="min-w-full whitespace-no-wrap">
						<thead>
						<tr class="tracking-wide text-center uppercase font-semibold text-xs text-gray-500 bg-gray-50">
							<th class="border-b" colspan="2">Buy Option</th>
							<th class="py-1 border-b border-s" colspan="10">Packages</th>
						</tr>
						<tr class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
							<th colspan="2" class="p-4 border-r">
								<Field form={superform} name="buyOptions[${index}].name">
									<Control let:attrs>
										<Label>Buy option name</Label>
										<Input {...attrs} bind:value={$formData.buyOptions[index].name} />
									</Control>
									<Description />
									<FieldErrors />
								</Field>
								<Link
									onClick={() => formData.update((formData) => ({buyOptions: [...formData.buyOptions.slice(0, index), ...formData.buyOptions.slice(index + 1)]}))}>
									<TrashIcon classes="text-red-400" />
								</Link>
							</th>
							{#each $formData.buyOptions[index].packages as _, packageIndex}
								<th class="px-4 py-3 text-sm font-normal border-r">
									<Field form={superform} name={`buyOptions[${index}].packages[${packageIndex}].name`}>
										<Control let:attrs>
											<Label>Package name</Label>
											<Input {...attrs} bind:value={$formData.buyOptions[index].packages[packageIndex].name} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
									<Field form={superform} name={`buyOptions[${index}].packages[${packageIndex}].price`}>
										<Control let:attrs>
											<Label>Package price</Label>
											<NumericInput {...attrs}
																		bind:value={$formData.buyOptions[index].packages[packageIndex].price} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
								</th>
							{/each}
							<th>
								<Link classes="inline-flex items-center" onClick={(e) => addPackage(e, index)}>
									<Plus class="inline mr-2" />
									Add package
								</Link>
							</th>
						</tr>
						</thead>
						<tbody class="bg-white divide-y">
						{#each $formData.buyOptions[index].services as _, serviceIndex}
							<tr>
								{#if serviceIndex === 0}
									<td
										class="[writing-mode:vertical-rl] rotate-180 tracking-wide text-xs font-semibold uppercase text-center p-1 border-r border-e"
										rowspan="10">Services
									</td>
								{/if}
								<td class="p-2 border-r">
									<div class="flex items-end gap-2 justify-stretch ">
										<Field class="flex-grow" form={superform}
													 name={`buyOptions[${index}].services[${serviceIndex}].name`}>
											<Control let:attrs>
												<Label>Service name</Label>
												<Input {...attrs} bind:value={$formData.buyOptions[index].services[serviceIndex].name} />
											</Control>
											<Description />
											<FieldErrors />
										</Field>
										<Field class="flex flex-col gap-y-1 justify-end" form={superform}
													 name={`buyOptions[${index}].services[${serviceIndex}].valueType`}>
											<Control let:attrs>
												<Label>Type</Label>
												<DropdownMenu.Root>
													<DropdownMenu.Trigger asChild let:builder>
														<Button class="!my-2 p-2" variant="outline" builders={[builder]}>
															{#if $formData.buyOptions[index].services[serviceIndex].valueType === 'STRING'}
																<Type />
															{:else if $formData.buyOptions[index].services[serviceIndex].valueType === 'BOOLEAN'}
																<Check />
															{:else if $formData.buyOptions[index].services[serviceIndex].valueType === 'INTEGER'}
																<Hash />
															{/if}
														</Button>
													</DropdownMenu.Trigger>
													<DropdownMenu.Content>
														<DropdownMenu.RadioGroup
															{...attrs}
															bind:value={$formData.buyOptions[index].services[serviceIndex].valueType}>
															<DropdownMenu.RadioItem
																value="STRING">
																Text
															</DropdownMenu.RadioItem>
															<DropdownMenu.RadioItem
																value="BOOLEAN">Enthalten
															</DropdownMenu.RadioItem>
															<DropdownMenu.RadioItem
																value="INTEGER">Betrag
															</DropdownMenu.RadioItem>
														</DropdownMenu.RadioGroup>
													</DropdownMenu.Content>
												</DropdownMenu.Root>
											</Control>
										</Field>
									</div>
									<Field form={superform} name={`buyOptions[${index}].services[${serviceIndex}].description`}>
										<Control let:attrs>
											<Label>Service description</Label>
											<Textarea {...attrs} class="min-h-fit transition-all focus:h-20 h-10 resize-none"
																bind:value={$formData.buyOptions[index].services[serviceIndex].description} />
										</Control>
										<Description />
										<FieldErrors />
									</Field>
								</td>
								{#each $formData.buyOptions[index].packages as _, packageIndex}
									<td class="py-2 px-4 align-top border-r">
										{#if $formData.buyOptions[index].services[serviceIndex].valueType === 'INTEGER'}
											<Field form={superform}
														 name={`buyOptions[${index}].packages[${packageIndex}].benefits[${serviceIndex}].numericValue`}>
												<Control let:attrs>
													<Label>Value</Label>
													<NumericInput {...attrs}
																				bind:value={$formData.buyOptions[index].packages[packageIndex].benefits[serviceIndex].numericValue} />
												</Control>
												<Description />
												<FieldErrors />
											</Field>
										{:else if $formData.buyOptions[index].services[serviceIndex].valueType === 'BOOLEAN'}
											<Field form={superform}
														 name={`buyOptions[${index}].packages[${packageIndex}].benefits[${serviceIndex}].booleanValue`}>
												<Control let:attrs>
													<Label>Value</Label>
													<Checkbox {...attrs}
																		bind:checked={$formData.buyOptions[index].packages[packageIndex].benefits[serviceIndex].booleanValue}
													/>
												</Control>
												<Description />
												<FieldErrors />
											</Field>
										{:else if $formData.buyOptions[index].services[serviceIndex].valueType === 'STRING'}
											<Field form={superform}
														 name={`buyOptions[${index}].packages[${packageIndex}].benefits[${serviceIndex}].stringValue`}>
												<Control let:attrs>
													<Label>Value</Label>
													<Input {...attrs}
																 bind:value={$formData.buyOptions[index].packages[packageIndex].benefits[serviceIndex].stringValue} />
												</Control>
												<Description />
												<FieldErrors />
											</Field>
										{/if}

									</td>
								{/each}
							</tr>
						{/each}
						</tbody>
						<tfoot class="border-t">
						<tr>
							<th colspan="2" class="p-2">
								<Link onClick={(e) => addService(e, index)}>Add Service</Link>
							</th>
							{#each $formData.buyOptions[index].packages as _, packageIndex}
								<td class="text-center">
									<Link onClick={(e) => removePackage(e, index, packageIndex)}>
										<TrashIcon classes="text-red-400" />
									</Link>
								</td>
							{/each}
						</tr>
						</tfoot>
					</table>
				</div>
			</div>
		{/each}
	{/if}
	<Link onClick={(e) => addBuyOption(e)}>Add buy option</Link>
	<GradientButton type="submit">{$_('common.save')}</GradientButton>
	<pre>{JSON.stringify($formData, null, 2)}</pre>
</form>
