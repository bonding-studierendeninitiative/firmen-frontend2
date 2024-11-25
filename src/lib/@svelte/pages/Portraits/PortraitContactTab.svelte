<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { InputWithPrefix, Textarea } from '$lib/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { type PortraitContactInfoSchema } from '$lib/services/portraitTemplates';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-french-toast';

	export let data: SuperValidated<Infer<typeof PortraitContactInfoSchema>>;

	const { form, enhance, constraints } = superForm(data, {
		resetForm: false,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success($_('user-pages.portraits.portraitUpdatedSuccessfully'));
			} else {
				console.log(result);
			}
		}
	});
</script>

<div>
	<form action="?/updatePortraitContactInfo" method="post" use:enhance>
		<section>
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.portraits.companyInformation')}
			</h2>
			<h4 class=" text-stone-500 text-sm">
				{$_('user-pages.portraits.companyInformationSubHeading')}
			</h4>
		</section>
		<section class=" w-full mt-10">
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.contactPersonStudents')}
				</div>
				<div class="col-span-3">
					<Textarea
						name="contactPersonStudents"
						bind:value={$form.contactPersonStudents}
						{...$constraints.contactPersonStudents}
						placeholder={$_('user-pages.portraits.contactPersonStudents')}
					/>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.contactPerson')}
				</div>
				<div class="col-span-3">
					<Textarea
						name="contactPersonGraduates"
						bind:value={$form.contactPersonGraduates}
						{...$constraints.contactPersonGraduates}
						placeholder={$_('user-pages.portraits.contactPerson')}
					/>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.contactAddress')}
				</div>
				<div class="col-span-3">
					<Textarea
						name="contactAddress"
						bind:value={$form.contactAddress}
						{...$constraints.contactAddress}
						placeholder={$_('user-pages.portraits.contactAddress')}
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.website')}
				</div>
				<div class="col-span-3">
					<InputWithPrefix
						name="website"
						bind:value={$form.website}
						{...$constraints.website}
						prefixText="https://"
						placeholder={$_('user-pages.portraits.website')}
					/>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Linkedin</div>
				<div class="col-span-3">
					<InputWithPrefix prefixText="https://www.linkedin.com/" placeholder="Linkedin" />
				</div>
			</div>
		</section>

		<footer>
			<div class=" flex justify-end items-center my-6 pb-6">
				<div class=" flex justify-between items-center">
					<Button variant="secondary" on:click={() => goto('/dashboard')} class=" mr-8">
						{$_('common.cancel')}
					</Button>
					<Button variant="gradient" type="submit">{$_('common.save')}</Button>
				</div>
			</div>
		</footer>
	</form>
</div>
