<script lang="ts">
	import { _ } from '@services';
	import { fade } from 'svelte/transition';
	import { LinkTabs } from '@/@svelte/components';

	const tabs = [{
		name: 'org-members',
		href: 'members'
	}, {
		name: 'organization',
		href: 'organization'
	}, {
		name: 'billing',
		href: 'billing'
	}, {
		name: 'archived',
		href: 'archived'
	}];
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.settings.account')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.settings.accountSubHeading')}</h4>
	<div class=" mt-12">
		<LinkTabs {tabs} />
	</div>
	<section class=" mt-10">
		<slot />
	</section>
</div>
