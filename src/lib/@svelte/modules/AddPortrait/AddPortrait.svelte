<script lang="ts">
	import { _ } from '@services';
	import {
		Drawer,
		Input,
		InputWithPrefix,
		Textarea,
		MultiSelect,
		TextField
	} from '$lib/@svelte/components';
	import { CloudUploadIcon } from '$lib/@svelte/icons';
	import Dropzone from 'svelte-file-dropzone';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import type { CreatePortraitTemplateRequest } from '$lib/services/portraitTemplates';
	import { toast } from 'svelte-french-toast';
	import { invalidate } from '$app/navigation';
	import { faker } from '@faker-js/faker';
	import { disciplines } from '@constant';
	import { Button } from '@/components/ui/button';

	export let isOpen: boolean = false;

	let currentStep = 1;
	let files: any = {
		accepted: [],
		rejected: []
	};

	$: isOpen ? (currentStep = 1) : null;

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	export let validated: SuperValidated<Infer<CreatePortraitTemplateRequest>>;
	const superform = superForm(validated, {
		onUpdate: async ({ result }) => {
			if (result.status === 200) {
				isOpen = false;
				await invalidate('app:catalogue-data-portraits');
				toast.success($_('user-pages.portraits.portraitAddedSuccessMessage'));
			} else {
				console.log(result);
			}
		}
	});
	const { form, constraints, enhance, errors } = superform;
</script>

<Drawer
	bind:isOpen
	heading={$_('user-pages.portraits.portrait')}
	handleSubmit={() => {
		console.log("Handle submit was called");
	}}
	hasActions={false}
>
	<Button variant="secondary" on:click={() => {
		form.set({
			industry: disciplines[Math.floor(Math.random()*disciplines.length)].value,
			title: faker.lorem.sentence(),
			products: faker.lorem.sentence(),
			displayName: faker.lorem.sentence(),
			comment: faker.lorem.sentence(),
			revenue_germany: faker.number.int({ min: 0, max: 500000 }).toString(),
			revenue_europe: faker.number.int({ min: 0, max: 1000000 }).toString(),
			revenue_worldwide: faker.number.int({ min: 0, max: 2000000 }).toString(),
			contactAddress: faker.location.streetAddress(),
			contactPersonStudents: faker.person.fullName(),
			contactPersonGraduates: faker.person.fullName(),
			locations_worldwide: faker.number.int({ min: 0, max: 10000 }).toString(),
			locations_europe: faker.number.int({ min: 0, max: 10000 }).toString(),
			locations_germany: faker.number.int({ min: 0, max: 10000 }).toString(),
			employees_worldwide: faker.number.int({ min: 0, max: 10000 }).toString(),
			employees_europe: faker.number.int({ min: 0, max: 10000 }).toString(),
			employees_germany: faker.number.int({ min: 0, max: 10000 }).toString(),
			website: faker.internet.domainName(),
			additionalInformation: faker.lorem.sentence(),
			offersThesis: faker.datatype.boolean(),
			entryOptions: faker.lorem.sentence(),
			desiredDisciplines: faker.lorem.sentence(),
			graduates: faker.number.int({ min: 0, max: 10000 }).toString(),
			offersOutOfCountryWork: faker.datatype.boolean(),
			offersInternships: faker.datatype.boolean()
		})
	}}>Generate random data
	</Button>
	<form action="?/createPortrait" method="post" use:enhance>
		{#if currentStep === 1}
			<div class="grid grid-cols-1 gap-y-4 w-full">
				<Input name="displayName" hintText={$_('user-pages.portraits.nameOfPortrait')}
							 label={$_('user-pages.portraits.nameOfPortrait')} bind:value={$form.displayName}
							 {...$constraints.displayName} />

				<TextField {superform} field="graduates" label={$_('user-pages.portraits.graduates')} />

				<Textarea name="comment" label={$_('user-pages.portraits.comments')} bind:value={$form.comment}
									{...$constraints.comment} />
				<hr />
				<Input name="title" label={$_('user-pages.portraits.title')} bind:value={$form.title}
							 {...$constraints.title} />
				<MultiSelect
					name="industry"
					items={disciplines}
					label={$_('user-pages.portraits.branch')}
					placeholder={$_('user-pages.portraits.selectAnyBranch')}
					bind:value={$form.industry}
					errorMessage={$errors.industry?.join('\n')}
					{...$constraints.industry}
				/>
				<Textarea name="products" label={$_('user-pages.portraits.products')} bind:value={$form.products}
									{...$constraints.products} />


				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="revenue_germany"
					bind:value={$form.revenue_germany}
					{...$constraints.revenue_germany}
					label={$_('user-pages.portraits.revenue')}
					prefixText={$_('user-pages.portraits.inland')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="revenue_europe" bind:value={$form.revenue_europe} {...$constraints.revenue_europe}
					prefixText={$_('user-pages.portraits.eu')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="revenue_worldwide" bind:value={$form.revenue_worldwide} {...$constraints.revenue_worldwide}
					prefixText={$_('user-pages.portraits.global')} />


				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="revenue_germany"
					bind:value={$form.locations_germany}
					{...$constraints.locations_germany}
					label={$_('user-pages.portraits.locations')}
					prefixText={$_('user-pages.portraits.inland')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="locations_europe" bind:value={$form.locations_europe} {...$constraints.locations_europe}
					prefixText={$_('user-pages.portraits.eu')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					name="locations_worldwide" bind:value={$form.locations_worldwide} {...$constraints.locations_worldwide}
					prefixText={$_('user-pages.portraits.global')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					prefixText={$_('user-pages.portraits.inland')}
					name="employees_germany"
					bind:value={$form.employees_germany}
					{...$constraints.employees_germany}
					label={$_('user-pages.portraits.numberOfEmployees')} />
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					prefixText={$_('user-pages.portraits.eu')}
					name="employees_europe" bind:value={$form.employees_europe} {...$constraints.employees_europe}
				/>
				<InputWithPrefix
					size="sm"
					addonClass="min-w-14"
					prefixText={$_('user-pages.portraits.global')}
					name="employees_worldwide" bind:value={$form.employees_worldwide} {...$constraints.employees_worldwide} />
				<hr />
				<div class=" grid grid-cols-1 gap-2">
					<Input
						name="contactAddress"
						bind:value={$form.contactAddress}
						{...$constraints.contactAddress}
						label={$_('user-pages.portraits.contactAddress')}
						placeholder={$_('user-pages.portraits.companyAddress')}
					/>
					<Input placeholder={$_('user-pages.portraits.branch')} />
					<div class=" grid grid-cols-2 gap-x-2">
						<Input placeholder={$_('user-pages.portraits.city')} />
						<Input placeholder={$_('user-pages.portraits.zipCode')} />
					</div>
				</div>
				<Textarea
					name="contactPersonStudents"
					label={$_('user-pages.portraits.contactPerson')}
					placeholder={$_('user-pages.portraits.name')}
					bind:value={$form.contactPersonStudents}
					{...$constraints.contactPersonStudents}
				/>
				<Textarea
					name="contactPersonGraduates"
					bind:value={$form.contactPersonGraduates}
					{...$constraints.contactPersonGraduates}
					label={$_('user-pages.portraits.contactPerson')}
					placeholder={$_('user-pages.portraits.name')}
				/>
				<InputWithPrefix
					prefixText="https://"
					name="website"
					bind:value={$form.website}
					{...$constraints.website}
					label={$_('user-pages.portraits.website')}
				/>
				<Textarea name="additionalInformation" bind:value={$form.additionalInformation}
									{...$constraints.additionalInformation}
									label={$_('user-pages.portraits.additionalInformation')} />


				<footer class=" mt-10 flex justify-between items-center mb-4">
					<p class=" text-sm text-stone-500">{$_('user-pages.portraits.lastEdited')}: 27 Dec 2023</p>
					<div class=" flex items-center">
						<Button
							variant="secondary"
							class="mr-2"
							on:click={() => {
							isOpen = false;
						}}
						>{$_('common.cancel')}
						</Button>
						<Button variant="gradient" type="submit">{$_('common.save')}</Button>
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
						</Dropzone
						>
					</div>
					<div class="w-full">
						<label class="block my-3 font-medium marker:text-sm text-stone-800" for="Locations"
						>{$_('user-pages.portraits.companyLogo')}</label
						>
						<div class=" flex">
							<img src="user.png" alt="User" />
							<div class=" flex flex-col ml-4">
								<div>
									<Button variant="secondary" on:click={() => undefined} classes="mb-3 !py-1.5"
									>{$_('common.upload')}</Button
									>
								</div>
								<p class="text-gray-500 text-sm font-normal">
									{$_('user-pages.portraits.logoInstructions')}
								</p>
							</div>
						</div>
					</div>
				</div>
				<footer class=" mt-10 flex justify-between items-center mb-4">
					<p class=" text-sm text-stone-500">{$_('user-pages.portraits.lastEdited')}: 27 Dec 2023</p>
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
</Drawer>
