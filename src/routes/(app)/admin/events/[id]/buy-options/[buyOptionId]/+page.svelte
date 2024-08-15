<script lang="ts">
	import { EditBuyOptions } from '@/@svelte/modules/EditBuyOptions/index.js';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>
<EditBuyOptions form={data.updateForm} />