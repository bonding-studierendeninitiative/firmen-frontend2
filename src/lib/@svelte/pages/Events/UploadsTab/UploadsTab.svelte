<script lang="ts">
	import { _ } from '@services';
	import { Button } from '$lib/@svelte/components';
</script>

<section>
	<label class="block mb-1.5 font-extrabold text-sm text-stone-800" for="companyLogo"
		>{$_('user-pages.portraits.companyLogo')}
	</label>
	<div class=" flex justify-between items-center mb-6" id="companyLogo">
		<div class=" flex">
			<div
				class={`rounded-lg bg-brand text-white font-extrabold inline-flex justify-center items-center  w-12 h-12`}
			>
				PDF
			</div>
			<div class=" flex flex-col ml-4">
				<h3 class=" text-sm font-medium text-stone-800">
					{$_('user-pages.portraits.companyLogo')}
				</h3>
				<h4 class=" text-sm font-medium text-stone-500">PNG - 1MB</h4>
			</div>
		</div>
		<Button onClick={() => undefined} classes=" inline shadow-custom !py-1"
			>{$_('common.download')}</Button
		>
	</div>
	<label class="block mb-1.5 font-extrabold text-sm text-stone-800" for="companyLogo"
		>{$_('user-pages.portraits.portraitUpload')}
	</label>
	<div class=" flex justify-between items-center mb-6">
		<div class=" flex">
			<div
				class={`rounded-lg bg-brand text-white font-extrabold inline-flex justify-center items-center  w-12 h-12`}
			>
				PDF
			</div>
			<div class=" flex flex-col ml-4">
				<h3 class=" text-sm font-medium text-stone-800">
					{$_('user-pages.portraits.portraitDocumentFile')}
				</h3>
				<h4 class=" text-sm font-medium text-stone-500">1 Page - PDF - 1MB</h4>
			</div>
		</div>
		<Button onClick={() => undefined} classes=" inline shadow-custom !py-1"
			>{$_('common.download')}</Button
		>
	</div>
</section>
