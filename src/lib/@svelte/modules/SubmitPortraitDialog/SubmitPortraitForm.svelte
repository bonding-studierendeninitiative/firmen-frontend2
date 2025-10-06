<script lang="ts">
	import * as RadioGroup from '@/components/ui/radio-group';
	import { Label } from '@/components/ui/label';
	import { Button } from '@/components/ui/form';
	import { _ } from '@services';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { submitPortraitAction } from '@/remote/functions';

	import {
		Field,
		Label as FormLabel,
		Control,
		Description,
		FieldErrors
	} from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/components/ui/checkbox';
	import * as Card from '@/components/ui/card';
	import {
		Loader2,
		ArrowLeft,
		ArrowRight,
		Check,
		FileEdit,
		FileText,
		Globe,
		Users,
		Phone,
		Eye,
		LoaderCircle
	} from '@lucide/svelte';
	import * as v from 'valibot';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { SubmitPortraitRequest } from '@schema';

	let {
		id,
		orgId,
		submitPortraitForm,
		onSubmitPortrait
	}: {
		id: string;
		orgId: string;
		submitPortraitForm: SuperValidated<Infer<SubmitPortraitRequest>>;
		onSubmitPortrait?: (args: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	} = $props();

	const firstStepSchema = v.pick(SubmitPortraitRequest, [
		'title',
		'displayName',
		'comment',
		'industry',
		'products',
		'website'
	]);
	const secondStepSchema = v.pick(SubmitPortraitRequest, [
		'locationsWorldwide',
		'locationsEurope',
		'locationsGermany',
		'revenueWorldwide',
		'revenueEurope',
		'revenueGermany'
	]);
	const thirdStepSchema = v.pick(SubmitPortraitRequest, [
		'employeesWorldwide',
		'employeesEurope',
		'employeesGermany',
		'graduates',
		'desiredDisciplines',
		'entryOptions'
	]);
	const fourthStepSchema = v.pick(SubmitPortraitRequest, [
		'contactAddress',
		'contactPersonGraduates',
		'contactPersonStudents',
		'additionalInformation'
	]);

	let superform = superForm<Infer<SubmitPortraitRequest>>(submitPortraitForm, {
		validators: valibot(firstStepSchema),
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'error') {
				toast.error(result.error);
			} else if (result.type === 'success') {
				toast.success('Portrait submitted successfully');
			} else if (result.type === 'failure') {
				toast.warning('Failure' + JSON.stringify(result.data));
			}
		},
		onSubmit({ jsonData }) {
			jsonData({
				...$formData,
				eventRegistrationId: id
			});
		}
	});

	let { form: formData, enhance, reset, options, validateForm, submitting } = superform;

	$effect(() => {
		if (id) {
			$formData.eventRegistrationId = id;
		}
	});

	import { getAllPortraitTemplates as getPortraitTemplates } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';

	const portraitTemplatesQuery = getPortraitTemplates({ page: 0, query: '' });

	// Step titles and icons for the wizard
	const steps = [
		{ title: $_('modules.submit-portrait-form.step-0.short-title'), icon: FileText },
		{ title: $_('modules.submit-portrait-form.step-1.short-title'), icon: FileEdit },
		{ title: $_('modules.submit-portrait-form.step-2.short-title'), icon: Globe },
		{ title: $_('modules.submit-portrait-form.step-3.short-title'), icon: Users },
		{ title: $_('modules.submit-portrait-form.step-4.short-title'), icon: Phone },
		{ title: $_('modules.submit-portrait-form.step-5.short-title'), icon: Eye }
	];

	// Form state
	let currentStep = $state(0);
	let selectedTemplate: string = $state('');
	let startOption: 'template' | 'new' | '' = $state('');

	// Load template data when selected
	$effect(() => {
		if (startOption === 'template') {
			if (selectedTemplate) {
				const template = portraitTemplatesQuery.current?.portraitTemplates?.find(
					(p) => p.id === selectedTemplate
				);
				if (template) {
					$formData = { ...template };
				}
			}
		} else {
			reset();
		}
	});

	function updateValidator() {
		switch (currentStep) {
			case 1:
				options.validators = valibot(firstStepSchema);
				break;
			case 2:
				options.validators = valibot(secondStepSchema);
				break;
			case 3:
				options.validators = valibot(thirdStepSchema);
				break;
			case 4:
				options.validators = valibot(fourthStepSchema);
				break;
			case 5:
				options.validators = undefined;
				break;
		}
	}

	// Navigation functions
	async function nextStep() {
		if (currentStep >= 1 && currentStep <= 4) {
			const val = await validateForm({ update: true });
			if (val.valid) {
				currentStep++;
				updateValidator();
				window.scrollTo(0, 0);
			}
		} else {
			currentStep++;
			updateValidator();
			window.scrollTo(0, 0);
		}
	}

	function prevStep() {
		currentStep--;
		updateValidator();
		window.scrollTo(0, 0);
	}

	function resetForm() {
		reset();
		selectedTemplate = '';
		currentStep = 0;
		startOption = '';
	}
</script>

<div class="container mx-auto py-8 px-4">
	{#if currentStep > 0}
		<div class="mb-8 max-w-4xl mx-auto">
			<div class="flex justify-between items-center">
				{#each steps as step, index}
					<div
						class={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
					>
						<div
							class={[
								`flex items-center justify-center size-12 rounded-full mb-2 `,
								index < currentStep
									? 'bg-primary text-primary-foreground'
									: index === currentStep
										? 'border-2 border-primary'
										: 'border-2 border-muted'
							]}
						>
							<step.icon class="size-5" />
						</div>
						<span class="text-xs md:text-sm text-center">{step.title}</span>
					</div>
				{/each}
			</div>
			<div class="relative mt-2 mx-6">
				<div class="absolute top-0 h-1 bg-muted w-full"></div>
				<div
					class="absolute top-0 h-1 bg-primary transition-all"
					style="width: {(currentStep / (steps.length - 1)) * 100}%"
				></div>
			</div>
		</div>
	{/if}

	<form
		class="flex flex-col justify-between"
		{...submitPortraitAction.enhance(async ({ submit, form, data }) => {
			await onSubmitPortrait?.({ submit, form, data });
		})}
	>
		<div class="overflow-scroll">
			<!-- Step 0: Choose to start from scratch or use a template -->
			{#if currentStep === 0}
				<div class="space-y-8 py-4 max-w-4xl mx-auto">
					<h2 class="text-2xl font-semibold text-center mb-6">
						{$_('modules.submit-portrait-form.firstHeading')}
					</h2>

					<RadioGroup.Root bind:value={startOption}>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Label for="create-new-portrait">
								<RadioGroup.Item id="create-new-portrait" value="new" class="sr-only" />
								<Card.Root
									class={`cursor-pointer transition-all ${startOption === 'new' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
								>
									<Card.Header>
										<Card.Title class="flex items-center">
											<FileText class="size-5 mr-2" />
											{$_('modules.submit-portrait-form.start-from-scratch.title')}
										</Card.Title>
										<Card.Description
											>{$_(
												'modules.submit-portrait-form.start-from-scratch.description'
											)}</Card.Description
										>
									</Card.Header>
									<Card.Content>
										<p>{$_('modules.submit-portrait-form.start-from-scratch.body')}</p>
									</Card.Content>
									<Card.Footer class="justify-end">
										{#if startOption === 'new'}
											<Check class="size-5 text-primary" />
										{/if}
									</Card.Footer>
								</Card.Root>
							</Label>
							<Label for="use-template">
								<RadioGroup.Item id="use-template" value="template" class="sr-only" />
								<Card.Root
									class={`cursor-pointer transition-all ${startOption === 'template' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
								>
									<Card.Header>
										<Card.Title class="flex items-center">
											<FileEdit class="size-5 mr-2" />
											{$_('modules.submit-portrait-form.use-a-template.title')}
										</Card.Title>
										<Card.Description
											>{$_(
												'modules.submit-portrait-form.use-a-template.description'
											)}</Card.Description
										>
									</Card.Header>
									<Card.Content>
										<p>{$_('modules.submit-portrait-form.use-a-template.body')}</p>
									</Card.Content>
									<Card.Footer class="justify-end">
										{#if startOption === 'template'}
											<Check class="size-5 text-primary" />
										{/if}
									</Card.Footer>
								</Card.Root>
							</Label>
						</div>
					</RadioGroup.Root>

					{#if startOption === 'template'}
						<div class="mt-8 space-y-4">
							<h3 class="text-xl font-medium">
								{$_('modules.submit-portrait-form.select-template')}
							</h3>
							<RadioGroup.Root bind:value={selectedTemplate}>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									{#if portraitTemplatesQuery.loading}
										<LoaderCircle class="size-6 mx-auto animate-spin" />
									{:else}
										{#each portraitTemplatesQuery.current?.portraitTemplates ?? [] as template (template.id)}
											<Label for={`portrait-template-${template.id}`}>
												<RadioGroup.Item
													value={template.id}
													id={`portrait-template-${template.id}`}
													class="sr-only"
												/>
												<Card.Root
													class={`cursor-pointer transition-all ${selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
												>
													<Card.Header class="py-4">
														<div class="flex justify-between items-center">
															<div>
																<Card.Title class="text-lg">{template.displayName}</Card.Title>
																<Card.Description>{template.title}</Card.Description>
															</div>
															{#if selectedTemplate === template.id}
																<Check class="size-5 text-primary" />
															{/if}
														</div>
													</Card.Header>
													<Card.Content class="py-2">
														<p class="text-sm">
															<strong>Industry:</strong>
															{template.industry}
														</p>
														<p class="text-sm">
															<strong>Locations:</strong>
															{template.locations_germany} (Germany)
														</p>
													</Card.Content>
												</Card.Root>
											</Label>
										{/each}
									{/if}
								</div>
							</RadioGroup.Root>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 1: Basic Information -->
			{#if currentStep === 1}
				<div class="space-y-6 py-4 max-w-4xl mx-auto">
					<h2 class="text-2xl font-semibold mb-6">
						{$_('modules.submit-portrait-form.step-1.title')}
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Field form={superform} name="title">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Title*</FormLabel>
									<Input {...props} bind:value={$formData.title} />
								{/snippet}
							</Control>
							<FieldErrors />
						</Field>

						<Field form={superform} name="displayName">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Display Name*</FormLabel>
									<Input {...props} bind:value={$formData.displayName} />
								{/snippet}
							</Control>
							<FieldErrors />
						</Field>
					</div>

					<Field form={superform} name="comment">
						<Control>
							{#snippet children({ props })}
								<FormLabel>Comment</FormLabel>
								<Textarea {...props} bind:value={$formData.comment} />
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Field form={superform} name="industry">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Industry*</FormLabel>
									<Input {...props} bind:value={$formData.industry} />
								{/snippet}
							</Control>
							<FieldErrors />
						</Field>

						<Field form={superform} name="products">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Products</FormLabel>
									<Input {...props} bind:value={$formData.products} />
								{/snippet}
							</Control>
							<FieldErrors />
						</Field>
					</div>

					<Field form={superform} name="website">
						<Control>
							{#snippet children({ props })}
								<FormLabel>Website*</FormLabel>
								<Input {...props} bind:value={$formData.website} type="url" />
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>
				</div>
			{/if}

			<!-- Step 2: Locations & Revenue -->
			{#if currentStep === 2}
				<div class="space-y-8 py-4 max-w-4xl mx-auto">
					<h2 class="text-2xl font-semibold mb-6">Locations & Revenue</h2>

					<div class="space-y-8">
						<div>
							<h3 class="text-xl font-medium mb-4">Locations</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field form={superform} name="locationsWorldwide">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Worldwide*</FormLabel>
											<Input {...props} bind:value={$formData.locationsWorldwide} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="locationsEurope">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Europe*</FormLabel>
											<Input {...props} bind:value={$formData.locationsEurope} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="locationsGermany">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Germany*</FormLabel>
											<Input {...props} bind:value={$formData.locationsGermany} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>
							</div>
						</div>

						<div>
							<h3 class="text-xl font-medium mb-4">Revenue</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field form={superform} name="revenueWorldwide">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Worldwide*</FormLabel>
											<Input {...props} bind:value={$formData.revenueWorldwide} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="revenueEurope">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Europe*</FormLabel>
											<Input {...props} bind:value={$formData.revenueEurope} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="revenueGermany">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Germany*</FormLabel>
											<Input {...props} bind:value={$formData.revenueGermany} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 3: Employees & Offerings -->
			{#if currentStep === 3}
				<div class="space-y-8 py-4 max-w-4xl mx-auto">
					<h2 class="text-2xl font-semibold mb-6">Employees & Offerings</h2>

					<div class="space-y-8">
						<div>
							<h3 class="text-xl font-medium mb-4">Employees</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field form={superform} name="employeesWorldwide">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Worldwide*</FormLabel>
											<Input {...props} bind:value={$formData.employeesWorldwide} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="employeesEurope">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Europe*</FormLabel>
											<Input {...props} bind:value={$formData.employeesEurope} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="employeesGermany">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Germany*</FormLabel>
											<Input {...props} bind:value={$formData.employeesGermany} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>
							</div>
						</div>

						<div>
							<h3 class="text-xl font-medium mb-4">Recruitment</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field form={superform} name="graduates">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Graduates</FormLabel>
											<Input {...props} bind:value={$formData.graduates} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="desiredDisciplines">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Desired Disciplines</FormLabel>
											<Input {...props} bind:value={$formData.desiredDisciplines} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>

								<Field form={superform} name="entryOptions">
									<Control>
										{#snippet children({ props })}
											<FormLabel>Entry Options</FormLabel>
											<Input {...props} bind:value={$formData.entryOptions} />
										{/snippet}
									</Control>
									<FieldErrors />
								</Field>
							</div>
						</div>

						<div>
							<h3 class="text-xl font-medium mb-4">Opportunities</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field
									form={superform}
									name="offersThesis"
									class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
								>
									<Control>
										{#snippet children({ props })}
											<Checkbox {...props} bind:checked={$formData.offersThesis} />
											<div class="space-y-1 leading-none">
												<FormLabel>Offers Thesis</FormLabel>
												<Description>Company offers thesis opportunities</Description>
											</div>
										{/snippet}
									</Control>
								</Field>

								<Field
									form={superform}
									name="offersOutOfCountryWork"
									class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
								>
									<Control>
										{#snippet children({ props })}
											<Checkbox {...props} bind:checked={$formData.offersOutOfCountryWork} />
											<div class="space-y-1 leading-none">
												<FormLabel>International Work</FormLabel>
												<Description>Offers international work opportunities</Description>
											</div>
										{/snippet}
									</Control>
								</Field>

								<Field
									form={superform}
									name="offersInternships"
									class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
								>
									<Control>
										{#snippet children({ props })}
											<Checkbox {...props} bind:checked={$formData.offersInternships} />
											<div class="space-y-1 leading-none">
												<FormLabel>Offers Internships</FormLabel>
												<Description>Company offers internship opportunities</Description>
											</div>
										{/snippet}
									</Control>
								</Field>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 4: Contact & Additional -->
			{#if currentStep === 4}
				<div class="space-y-6 py-4 max-w-4xl mx-auto">
					<h2 class="text-2xl font-semibold mb-6">Contact & Additional Information</h2>

					<Field form={superform} name="contactAddress">
						<Control>
							{#snippet children({ props })}
								<FormLabel>Contact Address</FormLabel>
								<Textarea {...props} bind:value={$formData.contactAddress} />
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Field form={superform} name="contactPersonStudents">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Contact Person for Students</FormLabel>
									<Textarea {...props} bind:value={$formData.contactPersonStudents} />
								{/snippet}
							</Control>
							<Description>Maximum 5 lines allowed</Description>
							<FieldErrors />
						</Field>

						<Field form={superform} name="contactPersonGraduates">
							<Control>
								{#snippet children({ props })}
									<FormLabel>Contact Person for Graduates</FormLabel>
									<Textarea {...props} bind:value={$formData.contactPersonGraduates} />
								{/snippet}
							</Control>
							<FieldErrors />
						</Field>
					</div>

					<Field form={superform} name="additionalInformation">
						<Control>
							{#snippet children({ props })}
								<FormLabel>Additional Information*</FormLabel>
								<Textarea
									{...props}
									bind:value={$formData.additionalInformation}
									class="min-h-[150px]"
								/>
							{/snippet}
						</Control>
						<FieldErrors />
					</Field>
				</div>
			{/if}

			<!-- Step 5: Preview -->
			{#if currentStep === 5}
				<div class="space-y-6 py-4 max-w-5xl mx-auto">
					<h2 class="text-2xl font-semibold mb-6">Preview Your Portrait</h2>

					<div class="border rounded-lg overflow-hidden bg-white shadow-md">
						<div class="bg-primary/10 p-8 border-b">
							<h1 class="text-3xl font-bold">{$formData.displayName}</h1>
							<p class="text-muted-foreground text-lg mt-2">{$formData.title}</p>
						</div>

						<div class="p-8 space-y-8">
							<div>
								<h3 class="text-xl font-semibold mb-4">Company Information</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
									<div class="flex">
										<span class="font-medium w-32">Industry:</span>
										<span>{$formData.industry}</span>
									</div>
									{#if $formData.products}
										<div class="flex">
											<span class="font-medium w-32">Products:</span>
											<span>{$formData.products}</span>
										</div>
									{/if}
									<div class="flex">
										<span class="font-medium w-32">Website:</span>
										<span class="text-primary">{$formData.website}</span>
									</div>
									{#if $formData.comment}
										<div class="flex col-span-2">
											<span class="font-medium w-32">Comment:</span>
											<span>{$formData.comment}</span>
										</div>
									{/if}
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
								<div>
									<h3 class="text-xl font-semibold mb-4">Locations</h3>
									<div class="space-y-3">
										<div class="flex">
											<span class="font-medium w-32">Worldwide:</span>
											<span>{$formData.locationsWorldwide}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Europe:</span>
											<span>{$formData.locationsEurope}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Germany:</span>
											<span>{$formData.locationsGermany}</span>
										</div>
									</div>
								</div>

								<div>
									<h3 class="text-xl font-semibold mb-4">Revenue</h3>
									<div class="space-y-3">
										<div class="flex">
											<span class="font-medium w-32">Worldwide:</span>
											<span>{$formData.revenueWorldwide}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Europe:</span>
											<span>{$formData.revenueEurope}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Germany:</span>
											<span>{$formData.revenueGermany}</span>
										</div>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
								<div>
									<h3 class="text-xl font-semibold mb-4">Employees</h3>
									<div class="space-y-3">
										<div class="flex">
											<span class="font-medium w-32">Worldwide:</span>
											<span>{$formData.employeesWorldwide}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Europe:</span>
											<span>{$formData.employeesEurope}</span>
										</div>
										<div class="flex">
											<span class="font-medium w-32">Germany:</span>
											<span>{$formData.employeesGermany}</span>
										</div>
									</div>
								</div>

								<div>
									<h3 class="text-xl font-semibold mb-4">Opportunities</h3>
									<div class="space-y-3">
										{#if $formData.graduates}
											<div class="flex">
												<span class="font-medium w-32">Graduates:</span>
												<span>{$formData.graduates}</span>
											</div>
										{/if}
										{#if $formData.desiredDisciplines}
											<div class="flex">
												<span class="font-medium w-32">Disciplines:</span>
												<span>{$formData.desiredDisciplines}</span>
											</div>
										{/if}
										{#if $formData.entryOptions}
											<div class="flex">
												<span class="font-medium w-32">Entry Options:</span>
												<span>{$formData.entryOptions}</span>
											</div>
										{/if}
										<div class="mt-4 space-y-2">
											{#if $formData.offersThesis}
												<div class="flex items-center">
													<Check class="size-5 text-primary mr-2" />
													<span>Offers thesis opportunities</span>
												</div>
											{/if}
											{#if $formData.offersInternships}
												<div class="flex items-center">
													<Check class="size-5 text-primary mr-2" />
													<span>Offers internships</span>
												</div>
											{/if}
											{#if $formData.offersOutOfCountryWork}
												<div class="flex items-center">
													<Check class="size-5 text-primary mr-2" />
													<span>Offers international work</span>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 class="text-xl font-semibold mb-4">Contact Information</h3>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									{#if $formData.contactAddress}
										<div class="space-y-2">
											<h4 class="font-medium">Address:</h4>
											<p class="whitespace-pre-line">{$formData.contactAddress}</p>
										</div>
									{/if}
									{#if $formData.contactPersonStudents}
										<div class="space-y-2">
											<h4 class="font-medium">Contact for Students:</h4>
											<p class="whitespace-pre-line">{$formData.contactPersonStudents}</p>
										</div>
									{/if}
									{#if $formData.contactPersonGraduates}
										<div class="space-y-2">
											<h4 class="font-medium">Contact for Graduates:</h4>
											<p class="whitespace-pre-line">{$formData.contactPersonGraduates}</p>
										</div>
									{/if}
								</div>
							</div>

							{#if $formData.additionalInformation}
								<div>
									<h3 class="text-xl font-semibold mb-4">Additional Information</h3>
									<p class="whitespace-pre-line">{$formData.additionalInformation}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Navigation buttons -->
		<div class="flex justify-between mt-12 max-w-4xl mx-auto">
			{#if currentStep > 0}
				<Button type="button" variant="outline" onclick={prevStep}>
					<ArrowLeft class="size-4 mr-2" />
					Back
				</Button>
			{/if}

			<div class="space-x-4">
				{#if currentStep > 0}
					<Button type="button" variant="outline" onclick={resetForm}>Reset Form</Button>
				{/if}

				{#if currentStep < steps.length - 1}
					<Button
						type="button"
						onclick={nextStep}
						disabled={(currentStep === 0 && !startOption) ||
							(currentStep === 0 && startOption === 'template' && !selectedTemplate)}
					>
						Next
						<ArrowRight class="size-4 ml-2" />
					</Button>
				{:else}
					<Button type="submit" disabled={$submitting}>
						{#if $submitting}
							<Loader2 class="mr-2 size-4 animate-spin" />
							Submitting...
						{:else}
							Submit Portrait
						{/if}
					</Button>
				{/if}
			</div>
		</div>
	</form>
</div>
