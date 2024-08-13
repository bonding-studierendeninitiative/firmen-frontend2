<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { Button, GradientButton, Input, InputWithPrefix, MultiSelect, Textarea } from '$lib/@svelte/components';
	import { PortraitCompanyDetailsSchema } from '$lib/services/portraitTemplates';
	import { Helper } from 'flowbite-svelte';
	import { disciplines } from '@constant';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { toast } from 'svelte-french-toast';

	export let data: SuperValidated<Infer<typeof PortraitCompanyDetailsSchema>>;

	const { form, enhance, constraints } = superForm(data, {
		resetForm: false,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success($_('user-pages.portraits.portraitUpdatedSuccessfully'));
			}
		}
	});
</script>

<div>
	<form action="?/updatePortraitCompanyDetails" method="post" use:enhance>
		<section>
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.portraits.companyInformation')}
			</h2>
			<h4 class=" text-stone-500 text-sm">
				{$_('user-pages.portraits.companyInformationSubHeading')}
			</h4>
		</section>
		<section class=" w-full mt-10">
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
				<div class="col-span-1 flex flex-col">
					<div class="text-stone-800 text-sm font-extrabold">
						{$_('user-pages.portraits.companyName')}
					</div>
					<Helper>{$_('user-pages.portraits.companyNameHint')}</Helper>
				</div>
				<div class="col-span-3">
					<Input name="title" bind:value={$form.title} {...$constraints.title}
								 placeholder={$_('user-pages.portraits.companyName')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.branch')}
				</div>
				<div class="col-span-3">
					<MultiSelect name="industry" items={disciplines} bind:value={$form.industry}
											 placeholder={$_('user-pages.portraits.branch')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.products')}
				</div>
				<div class="col-span-3">
					<Textarea name="products" {...$constraints.products} bind:value={$form.products}
										placeholder={$_('user-pages.portraits.products')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.revenue')}
				</div>
				<div class="col-span-3 flex flex-col gap-y-4">
					<InputWithPrefix name="revenue_germany" addonClass="min-w-20" prefixText={$_('user-pages.portraits.inland')}
													 bind:value={$form.revenue_germany} placeholder={$_('user-pages.portraits.revenue')} />
					<InputWithPrefix name="revenue_europe" addonClass="min-w-20" prefixText={$_('user-pages.portraits.eu')}
													 bind:value={$form.revenue_europe} placeholder={$_('user-pages.portraits.revenue')} />
					<InputWithPrefix name="revenue_worldwide" addonClass="min-w-20" prefixText={$_('user-pages.portraits.global')}
													 bind:value={$form.revenue_worldwide}
													 placeholder={$_('user-pages.portraits.revenue')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.locations')}
				</div>
				<div class="col-span-3 flex flex-col gap-y-4">
					<InputWithPrefix name="locations_germany" addonClass="min-w-20" prefixText={$_('user-pages.portraits.inland')}
													 bind:value={$form.locations_germany}
													 {...$constraints.locations_germany}
													 placeholder={$_('user-pages.portraits.locations')} />
					<InputWithPrefix name="locations_europe" addonClass="min-w-20" prefixText={$_('user-pages.portraits.eu')}
													 bind:value={$form.locations_europe}
													 {...$constraints.locations_europe}
													 placeholder={$_('user-pages.portraits.locations')} />
					<InputWithPrefix name="locations_worldwide" addonClass="min-w-20"
													 prefixText={$_('user-pages.portraits.global')}
													 bind:value={$form.locations_worldwide}
													 {...$constraints.locations_worldwide}
													 placeholder={$_('user-pages.portraits.locations')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.portraits.numberOfEmployees')}
				</div>
				<div class="col-span-3 flex flex-col gap-y-4">
					<InputWithPrefix name="employees_germany" addonClass="min-w-20" prefixText={$_('user-pages.portraits.inland')}
													 bind:value={$form.employees_germany}
													 placeholder={$_('user-pages.portraits.employees')} />
					<InputWithPrefix name="employees_europe" addonClass="min-w-20" prefixText={$_('user-pages.portraits.eu')}
													 bind:value={$form.employees_europe}
													 placeholder={$_('user-pages.portraits.employees')} />
					<InputWithPrefix name="employees_worldwide" addonClass="min-w-20"
													 prefixText={$_('user-pages.portraits.global')}
													 bind:value={$form.employees_worldwide}
													 placeholder={$_('user-pages.portraits.employees')} />
				</div>
			</div>
		</section>

		<footer>
			<div class=" flex justify-end items-center my-6 pb-6">
				<div class=" flex justify-between items-center">
					<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
					<GradientButton type="submit">{$_('common.save')}</GradientButton>
				</div>
			</div>
		</footer>
	</form>
</div>
