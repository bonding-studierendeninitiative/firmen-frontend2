<script lang="ts">
	import { _ } from '@services/i18n';
	import type { PageServerData } from './$types';
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions';

	export let data: PageServerData;
</script>

<section class="mt-6">
	<EditBuyOptions form={data.updateForm} />
</section>
