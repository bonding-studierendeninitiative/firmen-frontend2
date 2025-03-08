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
	import { invalidate } from '$app/navigation';
	import { disciplines } from '@constant';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/components/ui/checkbox';
	import * as Select from '@/components/ui/select';
	import { type CreatePortraitTemplateRequest, PortraitTemplateSchema } from '@schema';
	import * as Sheet from '@/components/ui/sheet';
	import { Control, Description, Field, FieldErrors, Label, Legend } from '@/components/ui/form';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { cn } from '@/utils';
	import { BookOpen, Briefcase, Globe } from 'lucide-svelte';

	export let isOpen: boolean = false;
	let currentStep = 1;
	let files: any = {
		accepted: [],
		rejected: []
	};

	$: {
		isOpen ? (currentStep = 1) : null;
	}

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	export let validated: SuperValidated<Infer<CreatePortraitTemplateRequest>>;
	const superform = superForm(validated, {
		validators: valibotClient(PortraitTemplateSchema),
		onUpdate: async ({ result }) => {
			if (result.status === 200) {
				isOpen = false;
				await invalidate('app:catalogue-data-portraits');
				toast.success($_('user-pages.portraits.portraitAddedSuccessMessage'));
			} else {
				console.log(result);
				toast.error($_('user-pages.portraits.portraitAddedErrorMessage'));
			}
		}
	});
	const { form, constraints, enhance, errors } = superform;
	let selectedIndustries = [];
	$: {
		$form.industry = selectedIndustries ? selectedIndustries.map((selectedIndustry) => selectedIndustry.label).join(', ') : '';
	}


</script>

<Sheet.Root bind:open={isOpen}>
	<Sheet.Content side="right" size="large">
		<Sheet.Header>
			<Sheet.Title>{$_('user-pages.portraits.portrait')}</Sheet.Title>
			<Sheet.Description>
				{$_('user-pages.portraits.portraitCreateDescription')}
			</Sheet.Description>
		</Sheet.Header>
		<ScrollArea class="h-full pb-5">
			<Button
				variant="secondary"
				on:click={() => {
			form.set({
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
			<form action="?/createPortrait" id="create-portrait-form" method="post" use:enhance>
				{#if currentStep === 1}
					<div class="grid grid-cols-1 gap-y-4 w-full p-2">

						<Field form={superform} name="displayName">
							<Control let:attrs>
								<Label>{$_('user-pages.portraits.nameOfPortrait')}</Label>
								<Input
									{...attrs}
									bind:value={$form.displayName}
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
									bind:value={$form.comment}
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
									bind:value={$form.title}
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
									bind:value={$form.products}
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
										bind:value={$form.revenue_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="revenue_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.revenue_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="revenue_germany">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.revenue_worldwide}
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
										bind:value={$form.locations_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="locations_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.locations_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="locations_worldwide">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.locations_worldwide}
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
										bind:value={$form.employees_germany}
										prefixText={$_('user-pages.portraits.inland')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="employees_europe">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.employees_europe}
										prefixText={$_('user-pages.portraits.eu')}
									/>
								</Control>
								<Description />
								<FieldErrors />
							</Field>
							<Field form={superform} name="employees_worldwide">
								<Control let:attrs>
									<InputWithPrefix
										bind:value={$form.employees_worldwide}
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
									bind:value={$form.entryOptions}
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
								 $form.offersOutOfCountryWork ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$form.offersOutOfCountryWork} class="mr-3 data-[state=checked]:bg-primary"
														id="country-checkbox" />
									<label for="country-checkbox" class="flex items-center cursor-pointer">
										<Globe class="h-5 w-5 mr-2 text-muted-foreground" />
										<span class="text-sm font-medium">{$_('user-pages.portraits.offersOutOfCountryWork')}</span>
									</label>
								</div>
								<div class={cn(
									"flex items-center p-3 rounded-md border",
								 $form.offersInternships ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$form.offersInternships} class="mr-3 data-[state=checked]:bg-primary"
														id="internship-checkbox" />
									<label for="internship-checkbox" class="flex items-center cursor-pointer">
										<Briefcase class="h-5 w-5 mr-2 text-muted-foreground" />
										<span class="text-sm font-medium">{$_('user-pages.portraits.offersInternships')}</span>
									</label>
								</div>
								<div class={cn("flex items-center p-3 rounded-md border",
								 $form.offersThesis ? "bg-primary/5 border-primary/30" : "bg-card",
								)}>
									<Checkbox bind:checked={$form.offersThesis} class="mr-3 data-[state=checked]:bg-primary"
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
									bind:value={$form.graduates}
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
										bind:value={$form.contactAddress}
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
										bind:value={$form.contactPersonStudents}
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
										bind:value={$form.contactPersonGraduates}
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
										bind:value={$form.website}
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
									bind:value={$form.additionalInformation}
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
								<Button variant="default" type="submit" form="create-portrait-form">{$_('common.save')}</Button>
							</div>
						</footer>
					</div>
				{:else}
					<div class="w-full h-full flex flex-col justify-between">
						<div>
							<div>
								<label class="block mb-3 font-medium marker:text-sm text-stone-800" for="Locations"
								>{$_('user-pages.portraits.uploadPDF')}</label
								>
								<Dropzone
									disableDefaultStyles
									containerClasses=" border border-dashed border-gray-300 py-4 bg-gray-50"
									on:drop={handleFilesSelect}
								>
									<div class="  flex justify-center items-center flex-col">
										<CloudUploadIcon />
										<p class="mt-5 text-sm text-gray-500 font-normal">
											<span class=" text-brand">{$_('user-pages.portraits.clickToUpload')}</span>
											{$_('user-pages.portraits.orDragAndDrop')}
										</p>
										<p class="text-gray-500 text-sm font-normal">
											{$_('user-pages.portraits.fileInstructions')}
										</p>
									</div>
								</Dropzone>
							</div>
							<div class="w-full">
								<label class="block my-3 font-medium marker:text-sm text-stone-800" for="Locations">
									{$_('user-pages.portraits.companyLogo')}
								</label>
								<div class=" flex">
									<img src="user.png" alt="User" />
									<div class=" flex flex-col ml-4">
										<div>
											<Button variant="secondary" on:click={() => undefined} class="mb-3 !py-1.5">
												{$_('common.upload')}
											</Button>
										</div>
										<p class="text-gray-500 text-sm font-normal">
											{$_('user-pages.portraits.logoInstructions')}
										</p>
									</div>
								</div>
							</div>
						</div>
						<footer class=" mt-10 flex justify-between items-center mb-4">
							<p class=" text-sm text-stone-500">
								{$_('user-pages.portraits.lastEdited', {
									values: {
										date: '27 Dec 2023',
									}
								})}
							</p>
							<div class=" flex items-center">
								<Button
									variant="secondary"
									class="mr-2"
									on:click={() => {
								isOpen = false;
							}}
								>{$_('common.cancel')}
								</Button>
								<Button variant="gradient" type="submit" form={$page.form}>{$_('common.save')}</Button>
							</div>
						</footer>
					</div>
				{/if}
			</form>

		</ScrollArea>


	</Sheet.Content>
</Sheet.Root>