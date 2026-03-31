<script lang="ts">
	import { isOrgRegistered } from '@/remote/functions/events.remote.js';
	import SuperDebug from 'sveltekit-superforms';

	let { params } = $props();

	let isOrgRegisteredQuery = isOrgRegistered(params.eventId);
</script>

<SuperDebug data={isOrgRegisteredQuery.current} />
