<script lang="ts">
	import { _ } from '@services';
	import { fade } from 'svelte/transition';
	import { LinkTabs } from '@/@svelte/components';
	import * as Tabs from '@/components/ui/tabs';
	import { page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const tabs = [
		{
			name: 'account',
			href: 'account'
		},
		{
			name: 'organization',
			href: 'organization'
		},
		{
			name: 'billing',
			href: 'billing'
		},
		{
			name: 'archived',
			href: 'archived'
		}
	];
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.settings.account')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.settings.accountSubHeading')}</h4>
	<div class=" mt-12">
		<Tabs.Root value={page.url.pathname.split('/').pop() || 'organization'}>
			<Tabs.List>
				{#each tabs as { name, href }}
					<Tabs.Trigger value={name}>
						{#snippet child({ props })}
							<a
								{href}
								class=" text-stone-950 font-semibold hover:text-brand transition-colors"
								{...props}
							>
								{$_(`tab-headings.${name}`)}
							</a>
						{/snippet}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</Tabs.Root>
	</div>
	<section class=" mt-10">
		{@render children?.()}
	</section>
</div>
