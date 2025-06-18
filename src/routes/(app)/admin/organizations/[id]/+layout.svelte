<script lang="ts">
	import { Link, LinkTabs } from '@/@svelte/components';
	import * as Alert from '@/components/ui/alert';
	import * as Avatar from '@/components/ui/avatar';
	import { _ } from '@services';
	import { LoaderCircle, TriangleAlert } from 'lucide-svelte';

	let { data, children } = $props();
</script>

{#await data.organizationDetails}
	<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
{:then organizationDetails}
	<header class="space-y-6 mb-6">
		<Link href="/admin/organizations">{$_('admin-pages.organizations.back-to-overview')}</Link>
		{#if organizationDetails?.is_bonding}
			<Alert.Root class="bg-brand-yellow">
				<TriangleAlert class="w-5 h-5" />
				<Alert.Title>Das ist die bonding-Organisation</Alert.Title>
				<Alert.Description
					>Pass auf, wenn du auf dieser Seite änderungen durchführst.</Alert.Description
				>
			</Alert.Root>
		{/if}
		<div class="flex gap-4 items-center">
			<Avatar.Root>
				<Avatar.Image src={organizationDetails?.organization.imageUrl} />
				<Avatar.Fallback>{organizationDetails?.organization.name[0]}</Avatar.Fallback>
			</Avatar.Root>
			<h1 class=" text-stone-950 text-3xl font-extrabold">
				{organizationDetails?.organization.name}
			</h1>
		</div>
		{#if organizationDetails?.organization.publicMetadata?.type}
			<p>{$_(`common.org-types.${organizationDetails?.organization.publicMetadata?.type}`)}</p>
		{/if}
	</header>
	<LinkTabs
		tabs={[
			{
				name: 'companyInformation',
				href: `overview`
			},
			{
				name: 'portraits',
				href: `portraits`
			},
			{
				name: 'bookings',
				href: `registrations`
			}
		]}
	/>

	{@render children?.()}
{:catch error}
	<p>{error.message}</p>
{/await}
