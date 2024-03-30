<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, GradientButton, Input, InputWithPrefix, Select } from '$lib/@svelte/components';
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">Company Information</h2>
		<h4 class=" text-stone-500 text-sm">Update your company details here.</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-y-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Company Name</div>
			<div class="col-span-3">
				<Input placeholder="Company Name" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Address</div>
			<div class="col-span-3">
				<Input placeholder="Address" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">City & State</div>
			<div class="col-span-3">
				<div class="col-span-3 grid grid-cols-2 gap-4">
					<Select placeholder="City" />
					<Select placeholder="State" />
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Country</div>
			<div class="col-span-3">
				<Input placeholder="Country" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Sales tax ID (Optional)</div>
			<div class="col-span-3">
				<Input placeholder="Sale tax ID" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Website</div>
			<div class="col-span-3">
				<InputWithPrefix prefixText="https://" placeholder="Website" />
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
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">Cancel</Button>
				<GradientButton onClick={() => goto('/dashboard')}>Save</GradientButton>
			</div>
		</div>
	</footer>
</div>
