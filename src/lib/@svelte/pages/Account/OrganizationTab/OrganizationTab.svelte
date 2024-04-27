<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { Button, GradientButton, Input, InputWithPrefix, Select } from '$lib/@svelte/components';
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.accounts.companyInformation')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.accounts.companyInformationSubHeading')}
		</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.companyName')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.companyName')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.address')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.address')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.cityState')}
			</div>
			<div class="col-span-3">
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Select placeholder={$_('user-pages.accounts.city')} />
					<Select placeholder={$_('user-pages.accounts.state')} />
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.country')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.country')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.salesTaxIDOptional')}
			</div>
			<div class="col-span-3">
				<Input placeholder={$_('user-pages.accounts.saleTaxID')} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.website')}
			</div>
			<div class="col-span-3">
				<InputWithPrefix prefixText="https://" placeholder={$_('user-pages.accounts.website')} />
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
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
				<GradientButton onClick={() => goto('/dashboard')}>{$_('common.save')}</GradientButton>
			</div>
		</div>
	</footer>
</div>
