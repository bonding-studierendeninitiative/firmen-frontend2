<script lang="ts">
	import { _, faker } from '@services';
	import { FancyMultiSelect, InputWithPrefix } from '$lib/@svelte/components';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { disciplines } from '@constant';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/components/ui/checkbox';
	import {
		type CreatePortraitTemplateRequest,
		PortraitTemplateSchema,
		type UpdatePortraitTemplateRequest,
		UpdatePortraitTemplateRequestSchema
	} from '@schema';
	import * as Sheet from '@/components/ui/sheet';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { cn } from '@/utils';
	import { BookOpen, Briefcase, Globe, LoaderCircle } from '@lucide/svelte';

	const isEditMode = page.url.searchParams.get('edit') !== null;
	const portraitId = isEditMode ? page.url.searchParams.get('edit') : '';

	interface Props {
		isOpen?: boolean;
		onDialogChange?: (open: boolean) => void;
		validated:
			| SuperValidated<Infer<CreatePortraitTemplateRequest>>
			| SuperValidated<Infer<UpdatePortraitTemplateRequest>>;
	}

	let { isOpen = $bindable(false), onDialogChange = () => {}, validated }: Props = $props();
	const superform = superForm(validated, {
		dataType: 'json',
		validators: isEditMode
			? valibotClient(UpdatePortraitTemplateRequestSchema)
			: valibotClient(PortraitTemplateSchema),
		onSubmit: async ({ formData }) => {
			if (isEditMode && portraitId) {
				formData.set('id', portraitId);
			}
		},
		onResult: async ({ result }) => {
			if (result.status === 200) {
				isOpen = false;
				const q = new URLSearchParams(page.url.searchParams);
				q.delete('create');
				toast.success($_('user-pages.portraits.portraitAddedSuccessMessage'));
				await goto(`?${q}`, { noScroll: true });
			} else if (result.status === 204) {
				const q = new URLSearchParams(page.url.searchParams);
				q.delete('edit');
				toast.success($_('user-pages.portraits.portraitEditedSuccessMessage'));
				await goto(`?${q}`, { noScroll: true });
			} else {
				console.log(result);
				if (isEditMode) {
					toast.error($_('user-pages.portraits.portraitEditedErrorMessage'));
				} else {
					toast.error($_('user-pages.portraits.portraitAddedErrorMessage'));
				}
			}
		}
	});

	function convertDisciplineLabelsToObjects(input: string) {
		if (!input) return [];
		const labels = input.split(',').map((label) => label.trim()); // Split und trimmen
		return disciplines.filter((discipline) => labels.includes(discipline.label));
	}

	const { form: formData, enhance, submitting } = superform;

	function getSelectedIndustry() {
		console.log('Getting selected Industries');

		return convertDisciplineLabelsToObjects($formData.industry);
	}

	function setSelectedIndustry(values: {value: string; label: string}[]) {
		console.log('Setting selected Industries', values);
		$formData.industry = values
			? disciplines
					.filter((discipline) => values.includes(discipline))
					.map((selectedIndustry) => selectedIndustry.label)
					.join(', ')
			: '';
	}
</script>

<Sheet.Root bind:open={isOpen} onOpenChange={onDialogChange}>
	<Sheet.Content side="right" class="w-[1/2dvw] sm:max-w-[50ch]">
		<Sheet.Header>
			<Sheet.Title>{$_('user-pages.portraits.portrait')}</Sheet.Title>
			<Sheet.Description>
				{#if isEditMode}
					{$_('user-pages.portraits.portraitEditDescription')}
				{:else}
					{$_('user-pages.portraits.portraitCreateDescription')}
				{/if}
			</Sheet.Description>
		</Sheet.Header>
		<ScrollArea class="h-full pb-5">
			<Button
				disabled={isEditMode}
				variant="secondary"
				onclick={() => {
					formData.set({
						industry: disciplines[Math.floor(Math.random() * disciplines.length)].value,
						title: $faker.lorem.sentence(),
						products: $faker.lorem.sentence(),
						displayName: $faker.lorem.sentence(),
						comment: $faker.lorem.sentence(),
						revenue_germany: $faker.number.int({ min: 0, max: 500000 }).toString(),
						revenue_europe: $faker.number.int({ min: 0, max: 1000000 }).toString(),
						revenue_worldwide: $faker.number.int({ min: 0, max: 2000000 }).toString(),
						contactAddress: $faker.location.streetAddress(),
						contactPersonStudents: $faker.person.fullName(),
						contactPersonGraduates: $faker.person.fullName(),
						locations_worldwide: $faker.number.int({ min: 0, max: 10000 }).toString(),
						locations_europe: $faker.number.int({ min: 0, max: 10000 }).toString(),
						locations_germany: $faker.number.int({ min: 0, max: 10000 }).toString(),
						employees_worldwide: $faker.number.int({ min: 0, max: 10000 }).toString(),
						employees_europe: $faker.number.int({ min: 0, max: 10000 }).toString(),
						employees_germany: $faker.number.int({ min: 0, max: 10000 }).toString(),
						website: $faker.internet.domainName(),
						additionalInformation: $faker.lorem.sentence(),
						offersThesis: $faker.datatype.boolean(),
						entryOptions: $faker.lorem.sentence(),
						desiredDisciplines: $faker.lorem.sentence(),
						graduates: $faker.number.int({ min: 0, max: 10000 }).toString(),
						offersOutOfCountryWork: $faker.datatype.boolean(),
						offersInternships: $faker.datatype.boolean()
					});
				}}
				>{$_('modules.add-portrait.generate-random-data')}
			</Button>

			<form
				action={isEditMode ? '?/editPortrait' : '?/createPortrait'}
				id={isEditMode ? `create-portrait-form-${portraitId}` : 'create-portrait-form'}
				method="post"
				use:enhance
			>
				<div class="grid grid-cols-1 gap-y-4 w-full p-2">
					{#if $submitting}
						<LoaderCircle class="mr-2 size-4 animate-spin" />
					{/if}
					<Field form={superform} name="displayName">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.nameOfPortrait')}</Label>
								<Input
									{...props}
									bind:value={$formData.displayName}
									placeholder={$_('user-pages.portraits.nameOfPortrait')}
								/>
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<Field form={superform} name="comment">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.comments')}</Label>
								<Textarea {...props} bind:value={$formData.comment} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<hr />

					<Field form={superform} name="title">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.title')}</Label>
								<Input {...props} bind:value={$formData.title} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<Field form={superform} name="industry">
						<Control>
							<Label>{$_('user-pages.portraits.branch')}</Label>
							<FancyMultiSelect options={disciplines} bind:selected={getSelectedIndustry, setSelectedIndustry} placeholder={$_("user-pages.portraits.select-disciplines")} />
						</Control>

						<Description />
						<FieldErrors />
					</Field>
					<hr />

					<Field form={superform} name="products">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.products')}</Label>
								<Textarea {...props} bind:value={$formData.products} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<fieldset>
						<legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.revenue')}</legend
						>

						<Field form={superform} name="revenue_germany" class="mt-2">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.revenue_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="revenue_europe">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.revenue_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="revenue_germany">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.revenue_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</fieldset>

					<fieldset>
						<legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.locations')}</legend
						>

						<Field form={superform} name="locations_germany" class="mt-2">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.locations_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="locations_europe">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.locations_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="locations_worldwide">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.locations_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</fieldset>

					<fieldset>
						<legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.numberOfEmployees')}</legend
						>

						<Field form={superform} name="employees_germany" class="mt-2">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.employees_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="employees_europe">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.employees_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="employees_worldwide">
							<Control>
								{#snippet children({ props })}
									<InputWithPrefix
										{...props}
										bind:value={$formData.employees_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								{/snippet}
							</Control>
							<Description />
							<FieldErrors />
						</Field>
					</fieldset>

					<Field form={superform} name="entryOptions">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.entryOpportunities')}</Label>
								<Input {...props} bind:value={$formData.entryOptions} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<fieldset>
						<legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.offers')}</legend
						>
						<div class="flex flex-wrap gap-4 mt-2">
							<div
								class={cn(
									'flex items-center p-3 rounded-md border',
									$formData.offersOutOfCountryWork ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<Checkbox
									bind:checked={$formData.offersOutOfCountryWork}
									class="mr-3 data-[state=checked]:bg-primary"
									id="country-checkbox"
								/>
								<label for="country-checkbox" class="flex items-center cursor-pointer">
									<Globe class="size-5 mr-2 text-muted-foreground" />
									<span class="text-sm font-medium"
										>{$_('user-pages.portraits.offersOutOfCountryWork')}</span
									>
								</label>
							</div>
							<div
								class={cn(
									'flex items-center p-3 rounded-md border',
									$formData.offersInternships ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<Checkbox
									bind:checked={$formData.offersInternships}
									class="mr-3 data-[state=checked]:bg-primary"
									id="internship-checkbox"
								/>
								<label for="internship-checkbox" class="flex items-center cursor-pointer">
									<Briefcase class="size-5 mr-2 text-muted-foreground" />
									<span class="text-sm font-medium"
										>{$_('user-pages.portraits.offersInternships')}</span
									>
								</label>
							</div>
							<div
								class={cn(
									'flex items-center p-3 rounded-md border',
									$formData.offersThesis ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<Checkbox
									bind:checked={$formData.offersThesis}
									class="mr-3 data-[state=checked]:bg-primary"
									id="thesis-checkbox"
								/>
								<label for="thesis-checkbox" class="flex items-center cursor-pointer">
									<BookOpen class="size-5 mr-2 text-muted-foreground" />
									<span class="text-sm font-medium">{$_('user-pages.portraits.offersThesis')}</span>
								</label>
							</div>
						</div>
					</fieldset>

					<Field form={superform} name="graduates">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.graduates')}</Label>
								<Input {...props} bind:value={$formData.graduates} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>
					<hr />

					<div class=" grid grid-cols-1 gap-2">
						<Field form={superform} name="contactAddress">
							<Control>
								{#snippet children({ props })}
									<Label>{$_('user-pages.portraits.contactAddress')}</Label>
									<Textarea
										{...props}
										bind:value={$formData.contactAddress}
										placeholder={$_('user-pages.portraits.companyAddress')}
									/>
								{/snippet}
							</Control>

							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="contactPersonStudents">
							<Control>
								{#snippet children({ props })}
									<Label>{$_('user-pages.portraits.contactPerson')}</Label>
									<Input {...props} bind:value={$formData.contactPersonStudents} />
								{/snippet}
							</Control>

							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="contactPersonGraduates">
							<Control>
								{#snippet children({ props })}
									<Label>{$_('user-pages.portraits.contactPerson')}</Label>
									<Input {...props} bind:value={$formData.contactPersonGraduates} />
								{/snippet}
							</Control>

							<Description />
							<FieldErrors />
						</Field>
						<Field form={superform} name="website">
							<Control>
								{#snippet children({ props })}
									<Label>{$_('user-pages.portraits.website')}</Label>
									<InputWithPrefix
										{...props}
										prefixText="https://"
										{...props}
										bind:value={$formData.website}
									/>
								{/snippet}
							</Control>

							<Description />
							<FieldErrors />
						</Field>
					</div>

					<Field form={superform} name="additionalInformation">
						<Control>
							{#snippet children({ props })}
								<Label>{$_('user-pages.portraits.additionalInformation')}</Label>
								<Textarea {...props} bind:value={$formData.additionalInformation} />
							{/snippet}
						</Control>

						<Description />
						<FieldErrors />
					</Field>

					<footer class=" mt-10 flex justify-end items-center mb-4">
						<div class=" flex items-center">
							<Button
								variant="secondary"
								class="mr-2"
								onclick={() => {
									isOpen = false;
								}}
								>{$_('common.cancel')}
							</Button>
							{#if $submitting}
								<Button
									variant="default"
									type="submit"
									form={isEditMode ? `create-portrait-form-${portraitId}` : 'create-portrait-form'}
									disabled
								>
									<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.save')}
								</Button>
							{:else}
								<Button
									variant="default"
									type="submit"
									form={isEditMode ? `create-portrait-form-${portraitId}` : 'create-portrait-form'}
									>{$_('common.save')}</Button
								>
							{/if}
						</div>
					</footer>
				</div>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
