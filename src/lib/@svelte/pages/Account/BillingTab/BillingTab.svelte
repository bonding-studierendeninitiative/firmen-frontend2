<script lang="ts">
	import { goto } from '$app/navigation';
	import { BillingAddressCard, Button, GradientButton, Input } from '$lib/@svelte';

	const billingAddresses = [{ isDefault: true }, { isDefault: false }, { isDefault: true }];
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">Billings</h2>
		<h4 class=" text-stone-500 text-sm">Manage your billing and payment details.</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Company Name</div>
			<div class="col-span-3">
				<Input placeholder="Company Name" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Street, House No.</div>
			<div class="col-span-3">
				<Input placeholder="Street, House No." />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Postal code & City</div>
			<div class="col-span-3">
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Input placeholder="Postal code" />
					<Input placeholder="City" />
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Building (Optional)</div>
			<div class="col-span-3">
				<Input placeholder="Building" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Sales tax ID (Optional)</div>
			<div class="col-span-3">
				<Input placeholder="Sale tax ID" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Order ID / Reference ID</div>
			<div class="col-span-3">
				<Input placeholder="Order ID / Reference ID" />
			</div>
		</div>
	</section>
	<section class=" w-full mt-10">
		<h2 class=" text-stone-800 text-lg font-extrabold">Billing Address</h2>
		<h4 class=" text-stone-500 text-sm">Manage your billing and payment details.</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Billing Address</div>
			<div class="col-span-3 flex flex-col">
				{#each billingAddresses as { isDefault }, index (index)}
					<BillingAddressCard {isDefault} />
				{/each}
			</div>
		</div>
	</section>
	<footer>
		<div class=" flex justify-between items-center my-6 pb-6">
			<GradientButton onClick={() => undefined}>Add Billing Address</GradientButton>
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">Cancel</Button>
				<GradientButton onClick={() => goto('/dashboard')}>Save</GradientButton>
			</div>
		</div>
	</footer>
</div>
