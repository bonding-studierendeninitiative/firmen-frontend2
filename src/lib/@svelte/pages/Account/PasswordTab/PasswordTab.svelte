<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/@svelte/components';
	import { Button } from '@/components/ui/button';
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
				<Input placeholder="***********" type="password" errorMessage="moreThan8Characters" />
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
				<Button variant="secondary" on:click={() => goto('/dashboard')} class=" mr-8">{$_('common.cancel')}</Button>
				<Button variant="gradient" on:click={() => goto('/dashboard')}
					>{$_('user-pages.accounts.updatePassword')}</Button
				>
			</div>
		</div>
	</footer>
</div>
