<script lang="ts">
	import { _, faker } from '@services';
	import { FancyMultiSelect, InputWithPrefix } from '$lib/@svelte/components';
	import { page } from '$app/state';
	import { disciplines } from '@constant';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { ScrollArea } from '@/components/ui/scroll-area';
	import { Textarea } from '@/components/ui/textarea';
	import { Checkbox } from '@/components/ui/checkbox';
	import * as Sheet from '@/components/ui/sheet';
	import * as Field from '@/components/ui/field';
	import { cn } from '@/utils';
	import { BookOpen, Briefcase, Globe, LoaderCircle } from '@lucide/svelte';
	import { createPortraitTemplate, updatePortraitTemplate } from '@/remote/functions';

	const isEditMode = page.url.searchParams.get('edit') !== null;
	const portraitId = isEditMode ? page.url.searchParams.get('edit') : '';

	interface Props {
		isOpen?: boolean;
		onDialogChange?: (open: boolean) => void;
	}

	let { isOpen = $bindable(false), onDialogChange = () => {} }: Props = $props();

	// Use remote form functions - handle the different structures
	const portraitForm = isEditMode ? updatePortraitTemplate : createPortraitTemplate;

	// For edit mode, fields are nested under 'data', for create mode they're at the root
	const formFields = isEditMode ? (portraitForm.fields as any).data : portraitForm.fields;

	// Extract field references
	let {
		displayName,
		comment,
		title,
		industry,
		products,
		revenue_germany,
		revenue_europe,
		revenue_worldwide,
		locations_germany,
		locations_europe,
		locations_worldwide,
		employees_germany,
		employees_europe,
		employees_worldwide,
		entryOptions,
		offersOutOfCountryWork,
		offersInternships,
		offersThesis,
		graduates,
		contactAddress,
		contactPersonStudents,
		contactPersonGraduates,
		website,
		additionalInformation,
		desiredDisciplines
	} = formFields;

	function convertDisciplineLabelsToObjects(input: string) {
		if (!input) return [];
		const labels = input.split(',').map((label) => label.trim());
		return disciplines.filter((discipline) => labels.includes(discipline.label));
	}

	function getSelectedIndustry() {
		console.log('Getting selected Industries');
		return convertDisciplineLabelsToObjects(desiredDisciplines.value() || '');
	}

	function setSelectedIndustry(values: { value: string; label: string }[]) {
		console.log('Setting selected Industries', values);
		desiredDisciplines.set(
			values
				? disciplines
						.filter((discipline) => values.includes(discipline))
						.map((selectedIndustry) => selectedIndustry.label)
						.join(', ')
				: ''
		);
	}

	function generateRandomData() {
		industry.set($faker.lorem.sentence());
		title.set($faker.lorem.sentence());
		products.set($faker.lorem.sentence());
		displayName.set($faker.lorem.sentence());
		comment.set($faker.lorem.sentence());
		revenue_germany.set($faker.number.int({ min: 0, max: 500000 }).toString());
		revenue_europe.set($faker.number.int({ min: 0, max: 1000000 }).toString());
		revenue_worldwide.set($faker.number.int({ min: 0, max: 2000000 }).toString());
		contactAddress.set($faker.location.streetAddress());
		contactPersonStudents.set($faker.person.fullName());
		contactPersonGraduates.set($faker.person.fullName());
		locations_worldwide.set($faker.number.int({ min: 0, max: 10000 }).toString());
		locations_europe.set($faker.number.int({ min: 0, max: 10000 }).toString());
		locations_germany.set($faker.number.int({ min: 0, max: 10000 }).toString());
		employees_worldwide.set($faker.number.int({ min: 0, max: 10000 }).toString());
		employees_europe.set($faker.number.int({ min: 0, max: 10000 }).toString());
		employees_germany.set($faker.number.int({ min: 0, max: 10000 }).toString());
		website.set($faker.internet.domainName());
		additionalInformation.set($faker.lorem.sentence());
		offersThesis.set($faker.datatype.boolean());
		entryOptions.set($faker.lorem.sentence());
		desiredDisciplines.set($faker.lorem.sentence());
		graduates.set($faker.number.int({ min: 0, max: 10000 }).toString());
		offersOutOfCountryWork.set($faker.datatype.boolean());
		offersInternships.set($faker.datatype.boolean());
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
			<Button disabled={isEditMode} variant="secondary" onclick={generateRandomData}
				>{$_('modules.add-portrait.generate-random-data')}
			</Button>

			<form
				id={isEditMode ? `portrait-form-${portraitId}` : 'portrait-form'}
				{...portraitForm.enhance(async ({ submit }) => {
					await submit();
				})}
			>
				<div class="grid grid-cols-1 gap-y-4 w-full p-2">
					{#if portraitForm.pending > 0}
						<LoaderCircle class="mr-2 size-4 animate-spin" />
					{/if}
					<Field.Field>
						<Field.Label for="displayName">{$_('user-pages.portraits.nameOfPortrait')}</Field.Label>
						<Input
							id="displayName"
							{...displayName.as('text')}
							placeholder={$_('user-pages.portraits.nameOfPortrait')}
						/>
						{#each displayName.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Field>
						<Field.Label for="comment">{$_('user-pages.portraits.comments')}</Field.Label>
						<Textarea id="comment" {...comment.as('text')} />
						{#each comment.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<hr />

					<Field.Field>
						<Field.Label for="title">{$_('user-pages.portraits.title')}</Field.Label>
						<Input id="title" {...title.as('text')} />
						{#each title.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Field>
						<Field.Label for="branch">{$_('user-pages.portraits.branch')}</Field.Label>
						<FancyMultiSelect
							options={disciplines}
							bind:selected={getSelectedIndustry, setSelectedIndustry}
							placeholder={$_('user-pages.portraits.select-disciplines')}
						/>
						{#each desiredDisciplines.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>
					<hr />

					<Field.Field>
						<Field.Label for="industry">Industry*</Field.Label>
						<Textarea id="industry" {...industry.as('text')} />
						{#each industry.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Field>
						<Field.Label for="products">{$_('user-pages.portraits.products')}</Field.Label>
						<Textarea id="products" {...products.as('text')} />
						{#each products.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Set>
						<Field.Legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.revenue')}</Field.Legend
						>

						<Field.Field class="mt-2">
							<InputWithPrefix
								{...revenue_germany.as('text')}
								prefixText={$_('user-pages.portraits.inland')}
							/>
							{#each revenue_germany.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...revenue_europe.as('text')}
								prefixText={$_('user-pages.portraits.eu')}
							/>
							{#each revenue_europe.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...revenue_worldwide.as('text')}
								prefixText={$_('user-pages.portraits.global')}
							/>
							{#each revenue_worldwide.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
					</Field.Set>

					<Field.Set>
						<Field.Legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.locations')}</Field.Legend
						>

						<Field.Field class="mt-2">
							<InputWithPrefix
								{...locations_germany.as('text')}
								prefixText={$_('user-pages.portraits.inland')}
							/>
							{#each locations_germany.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...locations_europe.as('text')}
								prefixText={$_('user-pages.portraits.eu')}
							/>
							{#each locations_europe.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...locations_worldwide.as('text')}
								prefixText={$_('user-pages.portraits.global')}
							/>
							{#each locations_worldwide.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
					</Field.Set>

					<Field.Set>
						<Field.Legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.numberOfEmployees')}</Field.Legend
						>

						<Field.Field class="mt-2">
							<InputWithPrefix
								{...employees_germany.as('text')}
								prefixText={$_('user-pages.portraits.inland')}
							/>
							{#each employees_germany.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...employees_europe.as('text')}
								prefixText={$_('user-pages.portraits.eu')}
							/>
							{#each employees_europe.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<InputWithPrefix
								{...employees_worldwide.as('text')}
								prefixText={$_('user-pages.portraits.global')}
							/>
							{#each employees_worldwide.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
					</Field.Set>

					<Field.Field>
						<Field.Label for="entryOptions"
							>{$_('user-pages.portraits.entryOpportunities')}</Field.Label
						>
						<Input id="entryOptions" {...entryOptions.as('text')} />
						{#each entryOptions.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<Field.Set>
						<Field.Legend class="data-fs-error:text-destructive text-sm font-medium leading-none"
							>{$_('user-pages.portraits.offers')}</Field.Legend
						>
						<div class="flex flex-wrap gap-4 mt-2">
							<div
								class={cn(
									'flex items-center p-3 rounded-md border',
									offersOutOfCountryWork.value() ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<input
									{...offersOutOfCountryWork.as('checkbox')}
									class="mr-3 data-[state=checked]:bg-primary border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
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
									offersInternships.value() ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<input
									{...offersInternships.as('checkbox')}
									class="mr-3 data-[state=checked]:bg-primary border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
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
									offersThesis.value() ? 'bg-primary/5 border-primary/30' : 'bg-card'
								)}
							>
								<input
									{...offersThesis.as('checkbox')}
									class="mr-3 data-[state=checked]:bg-primary border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
									id="thesis-checkbox"
								/>
								<label for="thesis-checkbox" class="flex items-center cursor-pointer">
									<BookOpen class="size-5 mr-2 text-muted-foreground" />
									<span class="text-sm font-medium">{$_('user-pages.portraits.offersThesis')}</span>
								</label>
							</div>
						</div>
					</Field.Set>

					<Field.Field>
						<Field.Label for="graduates">{$_('user-pages.portraits.graduates')}</Field.Label>
						<Input id="graduates" {...graduates.as('text')} />
						{#each graduates.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>
					<hr />

					<div class="grid grid-cols-1 gap-2">
						<Field.Field>
							<Field.Label for="contactAddress"
								>{$_('user-pages.portraits.contactAddress')}</Field.Label
							>
							<Textarea
								id="contactAddress"
								{...contactAddress.as('text')}
								placeholder={$_('user-pages.portraits.companyAddress')}
							/>
							{#each contactAddress.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label for="contactPersonStudents"
								>{$_('user-pages.portraits.contactPerson')}</Field.Label
							>
							<Input id="contactPersonStudents" {...contactPersonStudents.as('text')} />
							{#each contactPersonStudents.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label for="contactPersonGraduates"
								>{$_('user-pages.portraits.contactPerson')}</Field.Label
							>
							<Input id="contactPersonGraduates" {...contactPersonGraduates.as('text')} />
							{#each contactPersonGraduates.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
						<Field.Field>
							<Field.Label for="website">{$_('user-pages.portraits.website')}</Field.Label>
							<InputWithPrefix prefixText="https://" {...website.as('url')} />
							{#each website.issues() ?? [] as issue}
								<div class="text-red-500 text-sm">{issue.message}</div>
							{/each}
						</Field.Field>
					</div>

					<Field.Field>
						<Field.Label for="additionalInformation"
							>{$_('user-pages.portraits.additionalInformation')}</Field.Label
						>
						<Textarea id="additionalInformation" {...additionalInformation.as('text')} />
						{#each additionalInformation.issues() ?? [] as issue}
							<div class="text-red-500 text-sm">{issue.message}</div>
						{/each}
					</Field.Field>

					<footer class="mt-10 flex justify-end items-center mb-4">
						<div class="flex items-center">
							<Button
								variant="secondary"
								class="mr-2"
								onclick={() => {
									isOpen = false;
								}}
								>{$_('common.cancel')}
							</Button>
							{#if portraitForm.pending > 0}
								<Button
									variant="default"
									type="submit"
									form={isEditMode ? `portrait-form-${portraitId}` : 'portrait-form'}
									disabled
								>
									<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.save')}
								</Button>
							{:else}
								<Button
									variant="default"
									type="submit"
									form={isEditMode ? `portrait-form-${portraitId}` : 'portrait-form'}
								>
									{$_('common.save')}
								</Button>
							{/if}
						</div>
					</footer>
				</div>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
