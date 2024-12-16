<script lang="ts">
	import { number, _ } from '@services/i18n';

	export let _package: {
		name: string;
		price: number;
	};
</script>

<section class="p-4 border border-gray-200 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
	<h5 class="col-span-2 text-sm">{$_("admin-pages.events.event-registrations.purchased-package")}</h5>
	<span>
		{_package.name}
	</span>
	<span class="text-end">
		{$number(_package.price / 100, {
			style: 'currency',
			currency: 'EUR',
			currencyDisplay: 'code'
		})}
	</span>
</section>