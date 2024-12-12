<script lang="ts">
	import { _ } from '@services';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Checkbox } from '$lib/@svelte/components';
	import { type UpdateBuyOptionRequest, ValueType } from '@schema';
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
	import * as Table from '@/components/ui/table';
	import { Separator } from '@/components/ui/separator';

	export let form: SuperValidated<Infer<UpdateBuyOptionRequest>>;

	const superform = superForm<Infer<UpdateBuyOptionRequest>>(form, {
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
	const { form: formData, enhance, isTainted, tainted } = superform;

	const removePackage = (e: Event, packageIndex: number) => {
		e.preventDefault();
		formData.update((oldForm) => ({
			...oldForm,
			packages: [
				...oldForm.packages.slice(0, packageIndex),
				...oldForm.packages.slice(packageIndex + 1)
			]
		}));
	};
	const addPackage = (e: Event) => {
		e.preventDefault();
		formData.update((oldForm) => ({
			...oldForm,
			packages: [
				...oldForm.packages,
				{
					name: '',
					description: '',
					benefits: new Array(oldForm.services.length).fill({
						numericValue: null,
						booleanValue: null,
						stringValue: null
					}),
					price: 0
				}
			]
		}));
	};
	const addService = (e: Event) => {
		e.preventDefault();
		formData.update((oldForm) => {
			return {
				...oldForm,
				services: [
					...oldForm.services,
					{
						name: '',
						description: '',
						valueType: ValueType.String
					}
				],
				packages: oldForm.packages.map((oldPackage) => ({
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
		});
	};
</script>

<form action="?/updateBuyOption" method="post" use:enhance class="space-y-8">
	<div class="pt-6 space-y-4">
		<div class="flex gap-1">
			<h3 class="font-semibold text-lg flex-grow">{$_("components.editBuyOptions.buyOption")}</h3>
			<Button disabled={!isTainted($tainted)} variant="default" type="submit"
			>{$_('common.saveAsDraft')}</Button
			>
		</div>
		<Field class="flex-col flex justify-start" form={superform} name="name">
			<Control let:attrs>
				<Label>{$_("components.editBuyOptions.buyOptionName")}</Label>
				<Input class="w-[40ch]" {...attrs} bind:value={$formData.name} />
			</Control>
			<Description />
			<FieldErrors />
		</Field>
	</div>
	<Separator />
	<div class="py-4 space-y-4">
		<h3 class="font-semibold text-lg flex-grow">{$_("components.editBuyOptions.packages")}</h3>
		<div class="rounded-lg overflow-x-scroll border">
			<Table.Root class="min-w-full whitespace-no-wrap">
				<Table.Header>
					<Table.Row class="bg-gray-50">
						<Table.Head
							class="text-center tracking-wide uppercase font-semibold text-xs text-gray-500"
							colspan={2}
						>{$_("components.editBuyOptions.buyOption")}
						</Table.Head>
						<Table.Head
							class="border-s text-center tracking-wide uppercase font-semibold text-xs text-gray-500"
							colspan={10}
						>{$_("components.editBuyOptions.packages")}
						</Table.Head>
					</Table.Row>
					<Table.Row class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
						<Table.Head colspan={2} class="p-4 border-r">
							<Field form={superform} name="name">
								<Control let:attrs>
									<Label>{$_("components.editBuyOptions.buyOptionName")}</Label>
									<Input {...attrs} bind:value={$formData.name} />
								</Control>
								<Description />
								<FieldErrors />
							</Field>
						</Table.Head>
						{#each $formData.packages as _somePackage, packageIndex}
							<Table.Head class="px-4 py-3 text-sm font-normal border-r">
								<Field form={superform} name={`packages[${packageIndex}].name`}>
									<Control let:attrs>
										<Label>{$_("components.editBuyOptions.packageName")}</Label>
										<Input {...attrs} bind:value={$formData.packages[packageIndex].name} />
									</Control>
									<Description />
									<FieldErrors />
								</Field>
								<Field form={superform} name={`packages[${packageIndex}].price`}>
									<Control let:attrs>
										<Label>{$_("components.editBuyOptions.packagePrice")}</Label>
										<NumericInput {...attrs} bind:value={$formData.packages[packageIndex].price} />
									</Control>
									<Description />
									<FieldErrors />
								</Field>
							</Table.Head>
						{/each}
						<th>
							<Button
								variant="link"
								class="inline-flex items-center"
								on:click={(e) => addPackage(e)}
							>
								<Plus class="inline mr-2" />
								{$_("components.editBuyOptions.addPackage")}
							</Button>
						</th>
					</Table.Row>
				</Table.Header>
				<tbody class="bg-white divide-y">
				{#each $formData.services as _someService, serviceIndex}
					<tr>
						{#if serviceIndex === 0}
							<td
								class="[writing-mode:vertical-rl] rotate-180 tracking-wide text-xs font-semibold uppercase text-center p-1 border-r border-e"
								rowspan="10"
							>{$_("components.editBuyOptions.services")}
							</td>
						{/if}
						<td class="p-2 border-r">
							<div class="flex items-end gap-2 justify-stretch">
								<Field class="flex-grow" form={superform} name={`services[${serviceIndex}].name`}>
									<Control let:attrs>
										<Label>{$_("components.editBuyOptions.serviceName")}</Label>
										<Input {...attrs} bind:value={$formData.services[serviceIndex].name} />
									</Control>
									<Description />
									<FieldErrors />
								</Field>
								<Field
									class="flex flex-col gap-y-1 justify-end"
									form={superform}
									name={`services[${serviceIndex}].valueType`}
								>
									<Control let:attrs>
										<Label>{$_("components.editBuyOptions.type")}</Label>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger asChild let:builder>
												<Button class="!my-2 p-2" variant="outline" builders={[builder]}>
													{#if $formData.services[serviceIndex].valueType === 'STRING'}
														<Type />
													{:else if $formData.services[serviceIndex].valueType === 'BOOLEAN'}
														<Check />
													{:else if $formData.services[serviceIndex].valueType === 'INTEGER'}
														<Hash />
													{/if}
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.RadioGroup
													{...attrs}
													bind:value={$formData.services[serviceIndex].valueType}
												>
													<DropdownMenu.RadioItem
														value="STRING">{$_("components.editBuyOptions.typeText")}</DropdownMenu.RadioItem>
													<DropdownMenu.RadioItem
														value="BOOLEAN">{$_("components.editBuyOptions.typeBoolean")}</DropdownMenu.RadioItem>
													<DropdownMenu.RadioItem
														value="INTEGER">{$_("components.editBuyOptions.typeNumeric")}</DropdownMenu.RadioItem>
												</DropdownMenu.RadioGroup>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Control>
								</Field>
							</div>
							<Field form={superform} name={`services[${serviceIndex}].description`}>
								<Control let:attrs>
									<Label>{$_("components.editBuyOptions.serviceDescription")}</Label>
									<Textarea
										{...attrs}
										class="min-h-fit transition-all focus:h-20 h-10 resize-none"
										bind:value={$formData.services[serviceIndex].description}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
						</td>
						{#each $formData.packages as _somePackage, packageIndex}
							<td class="py-2 px-4 align-top border-r">
								{#if $formData.services[serviceIndex].valueType === 'INTEGER'}
									<Field
										form={superform}
										name={`packages[${packageIndex}].benefits[${serviceIndex}].numericValue`}
									>
										<Control let:attrs>
											<Label>{$_("components.editBuyOptions.value")}</Label>
											<NumericInput
												{...attrs}
												bind:value={$formData.packages[packageIndex].benefits[serviceIndex]
														.numericValue}
											/>
										</Control>
										<Description />
										<FieldErrors />
									</Field>
								{:else if $formData.services[serviceIndex].valueType === 'BOOLEAN'}
									<Field
										form={superform}
										name={`packages[${packageIndex}].benefits[${serviceIndex}].booleanValue`}
									>
										<Control let:attrs>
											<Label>{$_("components.editBuyOptions.value")}</Label>
											<Checkbox
												{...attrs}
												bind:checked={$formData.packages[packageIndex].benefits[serviceIndex]
														.booleanValue}
											/>
										</Control>
										<Description />
										<FieldErrors />
									</Field>
								{:else if $formData.services[serviceIndex].valueType === 'STRING'}
									<Field
										form={superform}
										name={`packages[${packageIndex}].benefits[${serviceIndex}].stringValue`}
									>
										<Control let:attrs>
											<Label>{$_("components.editBuyOptions.value")}</Label>
											<Input
												{...attrs}
												bind:value={$formData.packages[packageIndex].benefits[serviceIndex]
														.stringValue}
											/>
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
					<Table.Head colspan={2} class="p-2">
						<Button variant="link" on:click={(e) => addService(e)}>{$_("components.editBuyOptions.addService")}</Button>
					</Table.Head>
					{#each $formData.packages as _package, packageIndex}
						<td class="text-center">
							<Button variant="link" on:click={(e) => removePackage(e, packageIndex)}>
								<TrashIcon classes="text-red-400" />
							</Button>
						</td>
					{/each}
				</tr>
				</tfoot>
			</Table.Root>
		</div>
		<div class="flex gap-1 justify-end">
			<Button disabled={!isTainted($tainted)} variant="default" type="submit"
			>{$_('common.saveAsDraft')}</Button
			>
		</div>
	</div>
</form>
