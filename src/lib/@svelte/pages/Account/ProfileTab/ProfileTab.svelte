<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { TrashIcon } from '$lib/@svelte/icons';
	import { Button, GradientButton, Input } from '$lib/@svelte/components';

	const contactInfo = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dept: '',
		areaOfResponsibility: '',
		responsibility: ''
	};
	let contacts = [{ ...contactInfo }];
	const handleAddMoreContact = () => {
		const contactCopy = [...contacts, { ...contactInfo }];
		contacts = contactCopy;
	};
	const handleRemoveContact = (index: number) => {
		const contactsCopy = [...contacts];
		contactsCopy.splice(index, 1);
		contacts = contactsCopy;
	};
</script>

<div>
	<section class="">
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.accounts.personalInformation')}
		</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.accounts.personalInformationSubHeading')}
		</h4>
	</section>
	{#each contacts as contact, index (contact)}
		<section class=" w-full mt-10">
			<div class=" pb-4 border-b-1 border-slate-200 flex justify-between items-center">
				<h4 class=" text-sm font-extrabold text-stone-800">
					{index + 1}. {$_('user-pages.accounts.contactPerson')}
				</h4>
				{#if contacts.length > 1}
					<button class=" m-0 text-red-500 text-xs" on:click={() => handleRemoveContact(index)}>
						<TrashIcon />
					</button>{/if}
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.fullName')}
				</div>
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Input placeholder={$_('user-pages.accounts.firstName')} />
					<Input placeholder={$_('user-pages.accounts.lastName')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts..emailAddress')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.emailAddress')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.phoneNumber')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.phoneNumber')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.department')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.department')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.areaOfResponsibility')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.areaOfResponsibility')} />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">
					{$_('user-pages.accounts.responsibility')}
				</div>
				<div class="col-span-3">
					<Input placeholder={$_('user-pages.accounts.responsibility')} />
				</div>
			</div>
		</section>
	{/each}

	<footer>
		<div class=" flex justify-between items-center my-6 pb-6">
			<GradientButton onClick={handleAddMoreContact}
				>{$_('user-pages.accounts.addContactPerson')}</GradientButton
			>
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
				<GradientButton onClick={() => goto('/dashboard')}>{$_('common.save')}</GradientButton>
			</div>
		</div>
	</footer>
</div>
