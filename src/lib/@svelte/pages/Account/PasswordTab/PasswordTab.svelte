<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { Button, GradientButton, Input } from '$lib/@svelte/components';
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">{$_('user-pages.accounts.password')}</h2>
		<h4 class=" text-stone-500 text-sm">
			{$_('user-pages.accounts.passwordSubHeading')}
		</h4>
	</section>
	<section class=" w-full mt-10">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.currentPassword')}
			</div>
			<div class="col-span-3">
				<Input placeholder="***********" type="password" />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.newPassword')}
			</div>
			<div class="col-span-3">
				<Input
					placeholder="***********"
					type="password"
					errorMessage={$_('validation-messages.moreThan8Characters')}
				/>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-6 border-b-1 border-slate-200">
			<div class="col-span-1 text-stone-800 text-sm font-extrabold">
				{$_('user-pages.accounts.confirmNewPassword')}
			</div>
			<div class="col-span-3">
				<Input placeholder="***********" type="password" />
			</div>
		</div>
	</section>

	<footer>
		<div class=" flex justify-end items-center my-6 pb-6">
			<div class=" flex justify-between items-center">
				<Button onClick={() => goto('/dashboard')} classes=" mr-8">{$_('common.cancel')}</Button>
				<GradientButton onClick={() => goto('/dashboard')}
					>{$_('user-pages.accounts.updatePassword')}</GradientButton
				>
			</div>
		</div>
	</footer>
</div>
