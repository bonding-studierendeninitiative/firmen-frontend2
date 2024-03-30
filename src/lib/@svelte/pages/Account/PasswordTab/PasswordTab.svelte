<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, GradientButton, Input } from '$lib/@svelte/components';
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">Password</h2>
		<h4 class=" text-stone-500 text-sm">
			Please enter your current password to change your password.
		</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Current Password</div>
			<div class="col-span-3">
				<Input placeholder="***********" type="password" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">New Password</div>
			<div class="col-span-3">
				<Input
					placeholder="***********"
					type="password"
					errorMessage="Your new password must be more than 8 characters."
				/>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">Confirm New Password</div>
			<div class="col-span-3">
				<Input placeholder="***********" type="password" />
			</div>
		</div>
	</section>

	<footer>
		<div class=" flex justify-end items-center my-6 pb-6">
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">Cancel</Button>
				<GradientButton onClick={() => goto('/dashboard')}>Update Passowrd</GradientButton>
			</div>
		</div>
	</footer>
</div>
