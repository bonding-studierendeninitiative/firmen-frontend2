<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Item from '@/components/ui/item';
	import { _ } from '@services';
	import { submitPortraitForm } from '@/remote/functions';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import * as RadioGroup from '@/components/ui/radio-group';
	import { Label } from '@/components/ui/label';
	import { Button } from '@/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import * as Card from '@/components/ui/card';
	import * as InputGroup from '@/components/ui/input-group';
	import * as Field from '@/components/ui/field';
	import {
		Loader2,
		ArrowLeft,
		ArrowRight,
		Check,
		FileEdit,
		FileText,
		FileInput,
		Globe,
		Users,
		Phone,
		Eye,
		LoaderCircle,
		Briefcase,
		BookOpen,
		Cross,
		X,
		Group,
		File
	} from '@lucide/svelte';
	import { getAllPortraitTemplates as getPortraitTemplates } from '@/remote/functions';
	import { cn } from '@/utils';
	import { FancyMultiSelect } from '@/@svelte/components';
	import { disciplines } from '@constant/portraitTemplates';
	import SuperDebug from 'sveltekit-superforms';

	let {
		open = $bindable(false),
		id,
		orgId,
		onSubmitPortrait
	}: {
		open: boolean;
		id: string;
		orgId: string;
		onSubmitPortrait?: (args: {
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
			data: FormData;
		}) => Promise<void>;
	} = $props();

	const {
		title,
		comment,
		industry,
		products,
		locationsWorldwide,
		locationsEurope,
		locationsGermany,
		revenueWorldwide,
		revenueEurope,
		revenueGermany,
		employeesWorldwide,
		employeesEurope,
		employeesGermany,
		graduates,
		desiredDisciplines,
		entryOptions,
		offersThesis,
		offersOutOfCountryWork,
		offersInternships,
		contactAddress,
		contactPersonStudents,
		contactPersonGraduates,
		website,
		additionalInformation,
		displayName,
		organization
	} = submitPortraitForm.fields;

	const portraitTemplatesQuery = getPortraitTemplates({ page: 0, query: '' });

	// Step titles and icons for the wizard
	const steps = [
		{ title: $_('modules.submit-portrait-form.step-0.short-title'), icon: FileText },
		{ title: $_('modules.submit-portrait-form.step-0.short-title-template'), icon: FileInput },
		{ title: $_('modules.submit-portrait-form.step-1.short-title'), icon: FileEdit },
		{ title: $_('modules.submit-portrait-form.step-2.short-title'), icon: Globe },
		{ title: $_('modules.submit-portrait-form.step-3.short-title'), icon: Users },
		{ title: $_('modules.submit-portrait-form.step-4.short-title'), icon: Phone },
		{ title: $_('modules.submit-portrait-form.step-5.short-title'), icon: Eye }
	];

	// Form state
	let currentStep = $state(0);
	let selectedTemplateId: string = $state('');
	let startOption: 'template' | 'new' | '' = $state('');
	let currentTemplate = undefined;

	// Load template data when selected
	$effect(() => {
		if (startOption === 'template') {
			if (selectedTemplateId) {
				const template = portraitTemplatesQuery.current?.portraitTemplates?.find(
					(p) => p.id === selectedTemplateId
				);
				if (template) {
					currentTemplate = template;
				}
			}
		}
	});

	// Navigation functions
	async function nextStep() {
		if (currentStep >= 2 && currentStep <= 5) {
			currentStep++;
			window.scrollTo(0, 0);
		} else {
			currentStep++;
			window.scrollTo(0, 0);
		}

		// Skip template step if not required
		if (currentStep == 1 && startOption !== 'template') {
			currentStep++;
		}

		submitPortraitForm.validate({
			includeUntouched: false,
			preflightOnly: true
		});
	}

	function prevStep() {
		currentStep--;
		window.scrollTo(0, 0);

		if (currentStep == 1 && startOption !== 'template') {
			currentStep--;
		}
	}

	function resetForm() {
		// TODO: Clear all data
		selectedTemplateId = '';
		currentStep = 0;
		startOption = '';
	}

	function convertDisciplineLabelsToObjects(input: string) {
		if (!input) return [];
		const labels = input.split(',').map((label) => label.trim()); // Split und trimmen
		return disciplines.filter((discipline) => labels.includes(discipline.label));
	}

	function getSelectedIndustry() {
		return convertDisciplineLabelsToObjects(desiredDisciplines.value());
	}

	function setSelectedIndustry(values: { value: string; label: string }[]) {
		desiredDisciplines.set(
			values
				? disciplines
						.filter((discipline) => values.includes(discipline))
						.map((selectedIndustry) => selectedIndustry.label)
						.join(', ')
				: ''
		);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="flex flex-col">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.submit-portrait-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.submit-portrait-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<!--<SuperDebug data={submitPortraitForm} />-->
		<div class="flex-1 overflow-visible">
			{#if currentStep > 1}
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
					<!-- <div class="relative mt-2 mx-6">
				<div class="absolute top-0 h-1 bg-muted w-full"></div>
				<div
					class="absolute top-0 h-1 bg-primary transition-all"
					style="width: {(currentStep / (steps.length - 1)) * 100}%"
				></div>
			</div> -->
				</div>
			{/if}
			<form
				id="portrait-submit-form"
				{...submitPortraitForm.enhance(async ({ submit, data }) => {
					console.log(data);
					try {
						await submitPortraitForm.validate();
						if (submitPortraitForm.fields.allIssues()?.length == 0) {
							await submit();
							toast.success('Portrait submitted successfully');
							open = false;
						} else {
							console.log(submitPortraitForm.fields.allIssues());
						}
					} catch (e) {
						toast.error((e as any)?.message ?? 'Error submitting portrait');
						console.error('Error uploading advertisment:', e);
					}
				})}
				class="overflow-y-auto max-h-[60vh] overflow-x-visible"
			>
				<input {...submitPortraitForm.fields.eventRegistrationId.as('hidden', id)} />
				<div class="space-y-6 py-4 max-w-5xl mx-auto">
					<!-- Step 0: Choose to start from scratch or use a template -->
					{#if currentStep === 0}
						<div>
							<h2 class="text-2xl font-semibold text-center mb-6">
								{$_('modules.submit-portrait-form.firstHeading')}
							</h2>

							<RadioGroup.Root
								class="grid grid-cols-1 md:grid-cols-2 gap-6"
								bind:value={startOption}
							>
								<Label for="create-new-portrait">
									<RadioGroup.Item id="create-new-portrait" value="new" class="sr-only" />
									<Item.Root
										variant="outline"
										class={`cursor-pointer transition-all ${startOption === 'new' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
									>
										<Item.Media variant="icon">
											<File class="text-muted-foreground" />
										</Item.Media>
										<Item.Content>
											<Item.Title class="flex items-center">
												{$_('modules.submit-portrait-form.start-from-scratch.title')}
											</Item.Title>
											<Item.Description
												>{$_(
													'modules.submit-portrait-form.start-from-scratch.description'
												)}</Item.Description
											>
										</Item.Content>
										<Item.Actions>
											<Check
												class={cn('size-5 text-primary', startOption !== 'new' ? 'opacity-0' : '')}
												aria-hidden={startOption !== 'new'}
											/>
										</Item.Actions>
									</Item.Root>
								</Label>
								<Label for="use-template">
									<RadioGroup.Item id="use-template" value="template" class="sr-only" />
									<Item.Root
										variant="outline"
										class={`cursor-pointer transition-all ${startOption === 'template' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
									>
										<Item.Media variant="icon">
											<FileInput class="text-muted-foreground" />
										</Item.Media>
										<Item.Content>
											<Item.Title class="flex items-center">
												{$_('modules.submit-portrait-form.use-a-template.title')}
											</Item.Title>
											<Item.Description
												>{$_(
													'modules.submit-portrait-form.use-a-template.description'
												)}</Item.Description
											>
										</Item.Content>
										<Item.Actions>
											<Check
												class={cn(
													'size-5 text-primary',
													startOption !== 'template' ? 'opacity-0' : ''
												)}
												aria-hidden={startOption !== 'template'}
											/>
										</Item.Actions>
									</Item.Root>
								</Label>
							</RadioGroup.Root>
						</div>
					{/if}
					<!-- Step 1: Select Template -->
					{#if currentStep === 1}
						<div>
							<h3 class="text-xl font-medium">
								{$_('modules.submit-portrait-form.select-template')}
							</h3>
							<RadioGroup.Root bind:value={selectedTemplateId}>
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
													class={`cursor-pointer transition-all ${selectedTemplateId === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
												>
													<Card.Header class="py-4">
														<div class="flex justify-between items-center">
															<div>
																<Card.Title class="text-lg">{template.displayName}</Card.Title>
																<Card.Description>{template.title}</Card.Description>
															</div>
															{#if selectedTemplateId === template.id}
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
					<!-- Step 2: Basic Information -->
					{#if currentStep === 2}
						<Field.Set>
							<h2 class="text-2xl font-semibold mb-6">
								{$_('modules.submit-portrait-form.step-1.title')}
							</h2>
							<Field.Field class="w-full">
								<Field.Label for="title">Title of Portrait (internal)</Field.Label>
								<Input id="title" class="w-full" {...submitPortraitForm.fields.title.as('text')} />
								{#each submitPortraitForm.fields.title.issues() ?? [] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							</Field.Field>
							<Field.Group class="grid grid-cols-2 w-full gap-6">
								<Field.Field>
									<Field.Label for="display-name">Display Name for Students*</Field.Label>
									<Input id="display-name" class="w-full" {...displayName.as('text')} />
									{#each displayName.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label for="organization">Official Company Name</Field.Label>
									<Input id="organization" class="w-full" {...organization.as('text')} />
									{#each organization.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
							</Field.Group>
							<Field.Field>
								<Field.Label for="comment">Comment (internal)</Field.Label>
								<Textarea id="comment" {...comment.as('text')} class="resize-none" />
								{#each comment.issues() ?? [] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							</Field.Field>
							<Field.Group class="grid grid-cols-2 w-full gap-6">
								<Field.Field>
									<Field.Label for="industry">Industry*</Field.Label>
									<Input id="industry" {...industry.as('text')} />
									{#each industry.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label for="products">Products</Field.Label>
									<Input id="products" {...products.as('text')} />
									{#each products.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
							</Field.Group>

							<Field.Field>
								<Field.Label for="branch">{$_('user-pages.portraits.branch')}</Field.Label>
								<FancyMultiSelect
									id="branch"
									options={disciplines}
									bind:selected={getSelectedIndustry, setSelectedIndustry}
									placeholder={$_('user-pages.portraits.select-disciplines')}
								/>
							</Field.Field>
						</Field.Set>
					{/if}

					<!-- Step 3: Locations & Revenue -->
					{#if currentStep === 3}
						<Field.Set>
							<Field.Legend class="text-2xl font-semibold mb-6">Locations</Field.Legend>

							<Field.Group class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Field.Field>
									<Field.Label
										class="data-fs-error:text-destructive text-sm font-medium leading-none"
										>{$_('user-pages.portraits.locations')}</Field.Label
									>
									<InputGroup.Root>
										<InputGroup.Input {...locationsGermany.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.inland')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each locationsGermany.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...locationsEurope.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.eu')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each locationsEurope.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...locationsWorldwide.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.global')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each locationsWorldwide.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label
										class="data-fs-error:text-destructive text-sm font-medium leading-none"
										>{$_('user-pages.portraits.revenue')}</Field.Label
									>

									<InputGroup.Root>
										<InputGroup.Input {...revenueGermany.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.inland')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each revenueGermany.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...revenueEurope.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.eu')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each revenueEurope.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...revenueWorldwide.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.global')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each revenueWorldwide.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>

								<Field.Field>
									<Field.Label
										class="data-fs-error:text-destructive text-sm font-medium leading-none"
										>{$_('user-pages.portraits.numberOfEmployees')}</Field.Label
									>

									<InputGroup.Root>
										<InputGroup.Input {...employeesGermany.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.inland')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each employeesGermany.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...employeesEurope.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.eu')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each employeesEurope.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
									<InputGroup.Root>
										<InputGroup.Input {...employeesWorldwide.as('text')} />
										<InputGroup.Addon>{$_('user-pages.portraits.global')}</InputGroup.Addon>
									</InputGroup.Root>
									{#each employeesWorldwide.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
							</Field.Group>
						</Field.Set>
					{/if}

					<!-- Step 4: Employees & Offerings -->
					{#if currentStep === 4}
						<div>
							<!--class="space-y-8 py-4 max-w-4xl mx-auto"-->
							<h2 class="text-2xl font-semibold mb-6">Employees & Offerings</h2>

							<div class="space-y-8">
								<Field.Set>
									<Field.Legend class="text-xl font-medium mb-4">Recruitment</Field.Legend>
									<Field.Group class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<Field.Field>
											<Field.Label for="graduates-url">Graduates</Field.Label>
											<Input id="graduates-url" {...graduates.as('url')} />
											{#each graduates.issues() ?? [] as issue}
												<div class="text-red-500 text-sm">{issue.message}</div>
											{/each}
										</Field.Field>

										<Field.Field>
											<Field.Label for="entry-options-url">Entry Options</Field.Label>
											<Input id="entry-options-url" {...entryOptions.as('url')} />
											{#each entryOptions.issues() ?? [] as issue}
												<div class="text-red-500 text-sm">{issue.message}</div>
											{/each}
										</Field.Field>
									</Field.Group>
								</Field.Set>

								<Field.Set>
									<Field.Legend
										class="data-fs-error:text-destructive text-sm font-medium leading-none"
										>{$_('user-pages.portraits.offers')}</Field.Legend
									>
									<Field.Group class="grid grid-cols-3 gap-4 mt-2">
										<Field.Field>
											<label
												for="country-checkbox"
												class={cn(
													'flex items-center cursor-pointer p-3 rounded-md border',
													offersOutOfCountryWork.value()
														? 'bg-primary/5 border-primary/30'
														: 'bg-card'
												)}
											>
												<input
													{...offersOutOfCountryWork.as('checkbox')}
													class="mr-3 data-[state=checked]:bg-primary 'border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50'"
													id="country-checkbox"
												/>
												<Globe class="size-5 mr-2 text-muted-foreground" />
												<span class="text-sm font-medium"
													>{$_('user-pages.portraits.offersOutOfCountryWork')}</span
												>
											</label>
										</Field.Field>
										<Field.Field>
											<label
												for="internships-checkbox"
												class={cn(
													'flex items-center cursor-pointer p-3 rounded-md border',
													offersInternships.value() ? 'bg-primary/5 border-primary/30' : 'bg-card'
												)}
											>
												<input
													{...offersInternships.as('checkbox')}
													class="mr-3 data-[state=checked]:bg-primary 'border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50'"
													id="internships-checkbox"
												/>
												<Briefcase class="size-5 mr-2 text-muted-foreground" />
												<span class="text-sm font-medium"
													>{$_('user-pages.portraits.offersInternships')}</span
												>
											</label>
										</Field.Field>
										<Field.Field>
											<label
												for="thesis-checkbox"
												class={cn(
													'flex items-center cursor-pointer p-3 rounded-md border',
													offersThesis.value() ? 'bg-primary/5 border-primary/30' : 'bg-card'
												)}
											>
												<input
													{...offersThesis.as('checkbox')}
													class="mr-3 data-[state=checked]:bg-primary 'border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50'"
													id="thesis-checkbox"
												/>
												<BookOpen class="size-5 mr-2 text-muted-foreground" />
												<span class="text-sm font-medium"
													>{$_('user-pages.portraits.offersThesis')}</span
												>
											</label>
										</Field.Field>
									</Field.Group>
								</Field.Set>
							</div>
						</div>
					{/if}

					<!-- Step 5: Contact & Additional -->
					{#if currentStep === 5}
						<Field.Set>
							<Field.Legend class="text-2xl font-semibold mb-6"
								>Contact & Additional Information</Field.Legend
							>
							<Field.Group>
								<Field.Field>
									<Field.Label for="contact-address"
										>{$_('user-pages.portraits.contactAddress')}</Field.Label
									>
									<Input id="contact-address" {...contactAddress.as('text')} />
									{#each contactAddress.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label for="contact-person-graduates"
										>{$_('user-pages.portraits.contactPerson')}</Field.Label
									>
									<Input id="contact-person-graduates" {...contactPersonGraduates.as('text')} />
									{#each contactPersonGraduates.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label for="contact-person-students"
										>{$_('user-pages.portraits.contactPersonStudents')}</Field.Label
									>
									<Input id="contact-person-students" {...contactPersonStudents.as('text')} />
									{#each contactPersonStudents.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
								<Field.Field>
									<Field.Label for="website">{$_('user-pages.portraits.website')}</Field.Label>
									<Input id="website" {...website.as('url')} />
									{#each website.issues() ?? [] as issue}
										<div class="text-red-500 text-sm">{issue.message}</div>
									{/each}
								</Field.Field>
							</Field.Group>
							<Field.Field>
								<Field.Label for="additional-information"
									>{$_('user-pages.portraits.additionalInformation')}</Field.Label
								>
								<Textarea
									id="additional-information"
									{...additionalInformation.as('text')}
									class="resize-none"
								/>
								{#each additionalInformation.issues() ?? [] as issue}
									<div class="text-red-500 text-sm">{issue.message}</div>
								{/each}
							</Field.Field>
						</Field.Set>
					{/if}

					<!-- Step 6: Preview -->
					{#if currentStep === 6}
						<div>
							<h2 class="text-xl font-semibold mb-4">Preview Your Portrait</h2>

							<div class="border rounded-lg overflow-hidden bg-white shadow-sm">
								<div class="bg-primary/10 p-4 border-b">
									<h1 class="text-2xl font-bold">{displayName.value()}</h1>
									<p class="text-muted-foreground mt-1">{title.value()}</p>
								</div>

								<div class="p-6 space-y-6">
									<div>
										<h3 class="text-lg font-semibold mb-3">Company Information</h3>
										<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
											<div class="flex">
												<span class="font-medium w-28">Industry:</span>
												<span>{industry.value()}</span>
											</div>
											<div class="flex">
												<span class="font-medium w-28">Products:</span>
												<span>{products.value()}</span>
											</div>
											<div class="flex">
												<span class="font-medium w-28">Website:</span>
												<span class="text-primary">{website.value()}</span>
											</div>
											<div class="flex col-span-2">
												<span class="font-medium w-28">Disciplines:</span>
												<span>{desiredDisciplines.value()}</span>
											</div>
											<div class="flex col-span-2">
												<span class="font-medium w-28">Comment:</span>
												<span>{comment.value()}</span>
											</div>
										</div>
									</div>
									<hr />
									<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
										<div>
											<h3 class="text-lg font-semibold mb-2">Locations</h3>
											<div class="space-y-1 text-sm">
												<div class="flex">
													<span class="font-medium w-24">Germany:</span>
													<span>{locationsGermany.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Europe:</span>
													<span>{locationsEurope.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Worldwide:</span>
													<span>{locationsWorldwide.value()}</span>
												</div>
											</div>
										</div>

										<div>
											<h3 class="text-lg font-semibold mb-2">Revenue</h3>
											<div class="space-y-1 text-sm">
												<div class="flex">
													<span class="font-medium w-24">Germany:</span>
													<span>{revenueGermany.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Europe:</span>
													<span>{revenueEurope.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Worldwide:</span>
													<span>{revenueWorldwide.value()}</span>
												</div>
											</div>
										</div>

										<div>
											<h3 class="text-lg font-semibold mb-2">Employees</h3>
											<div class="space-y-1 text-sm">
												<div class="flex">
													<span class="font-medium w-24">Germany:</span>
													<span>{employeesGermany.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Europe:</span>
													<span>{employeesEurope.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-24">Worldwide:</span>
													<span>{employeesWorldwide.value()}</span>
												</div>
											</div>
										</div>
									</div>
									<hr />
									<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div>
											<h3 class="text-lg font-semibold mb-2">Career Opportunities</h3>
											<div class="space-y-1 text-sm">
												<div class="flex">
													<span class="font-medium w-32">Graduates:</span>
													<span>{graduates.value()}</span>
												</div>
												<div class="flex">
													<span class="font-medium w-32">Entry Options:</span>
													<span>{entryOptions.value()}</span>
												</div>
											</div>
										</div>

										<div>
											<h3 class="text-lg font-semibold mb-2">What We Offer</h3>
											<div class="space-y-1 text-sm">
												<div class="flex items-center">
													{#if offersThesis.value()}
														<Check class="size-4 text-primary mr-2" />
													{:else}
														<X class="size-4 text-primary mr-2" />
													{/if}
													<span>Thesis opportunities: {offersThesis.value() ? 'Yes' : 'No'}</span>
												</div>
												<div class="flex items-center">
													{#if offersInternships.value()}
														<Check class="size-4 text-primary mr-2" />
													{:else}
														<X class="size-4 text-primary mr-2" />
													{/if}
													<span>Internships: {offersInternships.value() ? 'Yes' : 'No'}</span>
												</div>
												<div class="flex items-center">
													{#if offersOutOfCountryWork.value()}
														<Check class="size-4 text-primary mr-2" />
													{:else}
														<X class="size-4 text-primary mr-2" />
													{/if}
													<span
														>International work opportunities: {offersOutOfCountryWork.value()
															? 'Yes'
															: 'No'}</span
													>
												</div>
											</div>
										</div>
									</div>
									<hr />
									<div>
										<h3 class="text-lg font-semibold mb-2">Contact Information</h3>
										<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
											<div>
												<h4 class="font-medium mb-1">Address:</h4>
												<p class="whitespace-pre-line text-muted-foreground">
													{contactAddress.value()}
												</p>
											</div>
											<div>
												<h4 class="font-medium mb-1">Contact for Students:</h4>
												<p class="whitespace-pre-line text-muted-foreground">
													{contactPersonStudents.value()}
												</p>
											</div>
											<div>
												<h4 class="font-medium mb-1">Contact for Graduates:</h4>
												<p class="whitespace-pre-line text-muted-foreground">
													{contactPersonGraduates.value()}
												</p>
											</div>
										</div>
									</div>

									<div>
										<h3 class="text-lg font-semibold mb-2">Additional Information</h3>
										<p class="whitespace-pre-line text-sm text-muted-foreground">
											{additionalInformation.value()}
										</p>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</form>
		</div>
		<Dialog.Footer class="border-t bg-background p-4">
			<!-- Navigation buttons -->
			<div class="flex justify-between w-full">
				{#if currentStep > 0}
					<Button type="button" variant="outline" onclick={prevStep}>
						<ArrowLeft class="size-4 mr-2" />
						Back
					</Button>
					<Button type="button" variant="outline" onclick={resetForm}>Reset Form</Button>
				{:else}
					<div></div>
				{/if}
				{#if currentStep < steps.length - 1}
					<Button type="button" onclick={nextStep} disabled={currentStep === 0 && !startOption}>
						Next
						<ArrowRight class="size-4 ml-2" />
					</Button>
				{:else}
					<Button
						form="portrait-submit-form"
						type="submit"
						disabled={submitPortraitForm.pending > 0}
					>
						{#if submitPortraitForm.pending > 0}
							<Loader2 class="mr-2 size-4 animate-spin" />
							Submitting...
						{:else}
							Submit Portrait
						{/if}
					</Button>
				{/if}
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
