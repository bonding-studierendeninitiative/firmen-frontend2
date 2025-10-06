<script lang="ts">
	import { page } from '$app/state';
	import { isOrgRegistered } from '@/remote/functions/events.remote.js';
	import SuperDebug from 'sveltekit-superforms';

	let isOrgRegisteredQuery = isOrgRegistered(page.params.eventId!);
</script>

<SuperDebug data={isOrgRegisteredQuery.current} />
