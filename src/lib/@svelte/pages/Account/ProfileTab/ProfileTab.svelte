<script lang="ts">
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
		<h2 class=" text-stone-800 text-lg font-extrabold">Personal Information</h2>
		<h4 class=" text-stone-500 text-sm">Update your profile and organization details here.</h4>
	</section>
	{#each contacts as contact, index (contact)}
		<section class=" w-full mt-10">
			<div class=" pb-4 border-b-1 border-slate-200 flex justify-between items-center">
				<h4 class=" text-sm font-extrabold text-stone-800">{index + 1}. Contact Person</h4>
				{#if contacts.length > 1}
					<button class=" m-0 text-red-500 text-xs" on:click={() => handleRemoveContact(index)}>
						<TrashIcon />
					</button>{/if}
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Full name</div>
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Input placeholder="First Name" />
					<Input placeholder="Last Name" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Email Address</div>
				<div class="col-span-3">
					<Input placeholder="Email Address" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Phone Number</div>
				<div class="col-span-3">
					<Input placeholder="Phone number" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Department</div>
				<div class="col-span-3">
					<Input placeholder="Department" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Area of responsibility</div>
				<div class="col-span-3">
					<Input placeholder="Area of responsibility" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
				<div class="col-span-1 text-stone-800 text-sm font-extrabold">Responsibility</div>
				<div class="col-span-3">
					<Input placeholder="Responsibility" />
				</div>
			</div>
		</section>
	{/each}

	<footer>
		<div class=" flex justify-between items-center my-6 pb-6">
			<GradientButton onClick={handleAddMoreContact}>Add Contact Person</GradientButton>
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">Cancel</Button>
				<GradientButton onClick={() => goto('/dashboard')}>Save</GradientButton>
			</div>
		</div>
	</footer>
</div>
