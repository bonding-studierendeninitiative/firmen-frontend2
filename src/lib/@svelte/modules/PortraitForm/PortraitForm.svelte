<script lang="ts">
	import { _, faker } from '@services';
	import {
		InputWithPrefix
	} from '$lib/@svelte/components';
	import { CloudUploadIcon } from '$lib/@svelte/icons';
	import Dropzone from 'svelte-file-dropzone';
	import SuperDebug, { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { disciplines } from '@constant';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/components/ui/checkbox';
	import * as Select from '@/components/ui/select';
	import {
		type CreatePortraitTemplateRequest,
		GetPortraitTemplateResponse,
		PortraitTemplateSchema, type UpdatePortraitTemplateRequest,
		UpdatePortraitTemplateRequestSchema
	} from '@schema';
	import * as Sheet from '@/components/ui/sheet';
	import { Control, Description, Field, FieldErrors, Label, Legend } from '@/components/ui/form';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { cn } from '@/utils';
	import { BookOpen, Briefcase, Globe, LoaderCircle } from 'lucide-svelte';

	export let isOpen: boolean = false;
	export let onDialogChange: (open: boolean) => void = _ => {};

	let currentStep = 1;
	let files: any = {
		accepted: [],
		rejected: []
	};

	const isEditMode = $page.url.searchParams.get('edit') !== null;
	const portraitId = isEditMode ? $page.url.searchParams.get('edit') : "";

	export let validated: SuperValidated<Infer<CreatePortraitTemplateRequest>> | SuperValidated<Infer<UpdatePortraitTemplateRequest>> | undefined;
	const superform = superForm(validated, {
		dataType: "json",
		validators: isEditMode ? valibotClient(UpdatePortraitTemplateRequestSchema) : valibotClient(PortraitTemplateSchema),
		onSubmit: async ({ formData }) => {
			if (isEditMode) {
				formData.set("id", portraitId);
			}
		},
		onResult: async ({ result }) => {
			if (result.status === 200) {
				isOpen = false;
				const q = new URLSearchParams($page.url.searchParams);
				q.delete("create");
				toast.success($_('user-pages.portraits.portraitAddedSuccessMessage'));
				await goto(`?${q}`, { noScroll: true });

			}else if (result.status === 204) {
				const q = new URLSearchParams($page.url.searchParams);
				q.delete("edit");
				toast.success($_('user-pages.portraits.portraitEditedSuccessMessage'));
				await goto(`?${q}`, { noScroll: true });
			} else {
				console.log(result);
				if (isEditMode) {
					toast.error($_('user-pages.portraits.portraitEditedErrorMessage'));
				}else {
					toast.error($_('user-pages.portraits.portraitAddedErrorMessage'));
				}

			}
		}
	});


	function convertDisciplineLabelsToObjects(input: string) {
		if (!input) return [];
		const labels = input.split(',').map(label => label.trim()); // Split und trimmen
		return disciplines.filter(discipline => labels.includes(discipline.label));
	}


	const { form: formData, enhance, submitting,  } = superform;
	let selectedIndustries = convertDisciplineLabelsToObjects($formData.industry);
	$: {
		$formData.industry = selectedIndustries ? selectedIndustries.map((selectedIndustry) => selectedIndustry.label).join(', ') : '';
	}


</script>

<Sheet.Root bind:open={isOpen} onOpenChange={onDialogChange}>
	<Sheet.Content side="right" size="large">
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
				on:click={() => {
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
			>{$_("modules.add-portrait.generate-random-data")}
			</Button>

			<form action={isEditMode ? "?/editPortrait" : "?/createPortrait"} id={isEditMode ? `create-portrait-form-${portraitId}` : "create-portrait-form"} method="post" use:enhance>
					<div class="grid grid-cols-1 gap-y-4 w-full p-2">
						{#if $submitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						<Field form={superform} name="displayName">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.nameOfPortrait')}</Label>
								<Input
									{...attrs}
									bind:value={$formData.displayName}
									placeholder={$_('user-pages.portraits.nameOfPortrait')}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>


						<Field form={superform} name="comment">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.comments')}</Label>
								<Textarea
									{...attrs}
									bind:value={$formData.comment}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>

						<hr />

						<Field form={superform} name="title">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.title')}</Label>
								<Input
									{...attrs}
									bind:value={$formData.title}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>

						<Field form={superform} name="industy">
							<Control>
								<Label>{$_('user-pages.portraits.branch')}</Label>
								<Select.Root multiple bind:selected={selectedIndustries}>
									<Select.Trigger>
										<Select.Value />
									</Select.Trigger>
									<Select.Content>
										{#each disciplines as discipline}
											<Select.Item value={discipline.value}>{discipline.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Control>

							<Description />
							<FieldErrors />
						</Field>
						<hr />

						<Field form={superform} name="products">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.products')}</Label>
								<Textarea
									{...attrs}
									bind:value={$formData.products}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>

						<fieldset>
							<legend
								class="data-[fs-error]:text-destructive text-sm font-medium leading-none">{$_('user-pages.portraits.revenue')}</legend>

							<Field form={superform} name="revenue_germany" class="mt-2">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.revenue_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="revenue_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.revenue_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="revenue_germany">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.revenue_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>


						</fieldset>

						<fieldset>
							<legend
								class="data-[fs-error]:text-destructive text-sm font-medium leading-none">{$_('user-pages.portraits.locations')}</legend>

							<Field form={superform} name="locations_germany" class="mt-2">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.locations_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="locations_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.locations_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="locations_worldwide">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.locations_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
						</fieldset>

						<fieldset>
							<legend
								class="data-[fs-error]:text-destructive text-sm font-medium leading-none">{$_('user-pages.portraits.numberOfEmployees')}</legend>

							<Field form={superform} name="employees_germany" class="mt-2">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.employees_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="employees_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.employees_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="employees_worldwide">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$formData.employees_worldwide}
										prefixText={$_('user-pages.portraits.global')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>


						</fieldset>

						<Field form={superform} name="entryOptions">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.entryOpportunities')}</Label>
								<Input
									{...attrs}
									bind:value={$formData.entryOptions}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>

						<fieldset>
							<legend
								class="data-[fs-error]:text-destructive text-sm font-medium leading-none">{$_('user-pages.portraits.offers')}</legend>
							<div class="flex flex-wrap gap-4 mt-2">
								<div class={cn(
									"flex items-center p-3 rounded-md border",
								 $formData.offersOutOfCountryWork ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$formData.offersOutOfCountryWork} class="mr-3 data-[state=checked]:bg-primary"
														id="country-checkbox" />
									<label for="country-checkbox" class="flex items-center cursor-pointer">
										<Globe class="h-5 w-5 mr-2 text-muted-foreground" />
										<span class="text-sm font-medium">{$_('user-pages.portraits.offersOutOfCountryWork')}</span>
									</label>
								</div>
								<div class={cn(
									"flex items-center p-3 rounded-md border",
								 $formData.offersInternships ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$formData.offersInternships} class="mr-3 data-[state=checked]:bg-primary"
														id="internship-checkbox" />
									<label for="internship-checkbox" class="flex items-center cursor-pointer">
										<Briefcase class="h-5 w-5 mr-2 text-muted-foreground" />
										<span class="text-sm font-medium">{$_('user-pages.portraits.offersInternships')}</span>
									</label>
								</div>
								<div class={cn("flex items-center p-3 rounded-md border",
								 $formData.offersThesis ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$formData.offersThesis} class="mr-3 data-[state=checked]:bg-primary"
														id="thesis-checkbox" />
									<label for="thesis-checkbox" class="flex items-center cursor-pointer">
										<BookOpen class="h-5 w-5 mr-2 text-muted-foreground" />
										<span class="text-sm font-medium">{$_('user-pages.portraits.offersThesis')}</span>
									</label>
								</div>
							</div>

						</fieldset>

						<Field form={superform} name="graduates">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.graduates')}</Label>
								<Input
									{...attrs}
									bind:value={$formData.graduates}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>
						<hr />

						<div class=" grid grid-cols-1 gap-2">

							<Field form={superform} name="contactAddress">
								<Control let:attrs>
									<Label>{$_('user-pages.portraits.contactAddress')}</Label>
									<Textarea
										{...attrs}
										bind:value={$formData.contactAddress}
										placeholder={$_('user-pages.portraits.companyAddress')}
									/>
								</Control>

								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="contactPersonStudents">
								<Control let:attrs>
									<Label>{$_('user-pages.portraits.contactPerson')}</Label>
									<Input
										{...attrs}
										bind:value={$formData.contactPersonStudents}
									/>
								</Control>

								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="contactPersonGraduates">
								<Control let:attrs>
									<Label>{$_('user-pages.portraits.contactPerson')}</Label>
									<Input
										{...attrs}
										bind:value={$formData.contactPersonGraduates}
									/>
								</Control>

								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="website">
								<Control let:attrs>
									<Label>{$_('user-pages.portraits.website')}</Label>
									<InputWithPrefix
										prefixText="https://"
										{...attrs}
										bind:value={$formData.website}
									/>
								</Control>

								<Description />
								<FieldErrors />
							</Field>
						</div>

						<Field form={superform} name="additionalInformation">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.additionalInformation')}</Label>
								<Textarea
									{...attrs}
									bind:value={$formData.additionalInformation}
								/>
							</Control>

							<Description />
							<FieldErrors />
						</Field>


						<footer class=" mt-10 flex justify-end items-center mb-4">

							<div class=" flex items-center">
								<Button
									variant="secondary"
									class="mr-2"
									on:click={() => {
								isOpen = false;
							}}
								>{$_('common.cancel')}
								</Button>
								{#if $submitting}
									<Button variant="default" type="submit" form={isEditMode ? `create-portrait-form-${portraitId}` : "create-portrait-form"} disabled>
										<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_('common.save')}{$_('common.delete')}
									</Button>
								{:else}
									<Button variant="default" type="submit" form={isEditMode ? `create-portrait-form-${portraitId}` : "create-portrait-form"}>{$_('common.save')}</Button>
								{/if}
							</div>
						</footer>
					</div>

			</form>

		</ScrollArea>


	</Sheet.Content>
</Sheet.Root>