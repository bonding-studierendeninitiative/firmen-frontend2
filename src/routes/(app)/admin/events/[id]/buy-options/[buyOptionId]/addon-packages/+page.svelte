<script lang="ts">
	import { _ } from '@services';
	import EditAddonPackages from './edit-addon-packages.svelte';
	let { params } = $props();
	let eventId = params.id;
	let buyOptionId = params.buyOptionId;
</script>

<EditAddonPackages {eventId} {buyOptionId} />
