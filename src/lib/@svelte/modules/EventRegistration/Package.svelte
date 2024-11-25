<script lang="ts">
	import { number } from '@services/i18n';

	export let _package: {
		name: string;
		price: number;
	};
</script>

<section>
	<span>
		{_package.name}
	</span>
	<span>
		{$number(_package.price / 100, {
			style: 'currency',
			currency: 'EUR',
			currencyDisplay: 'code'
		})}
	</span>
</section>