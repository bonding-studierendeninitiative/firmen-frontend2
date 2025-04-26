<script lang="ts">
	import { Link, LinkTabs } from '@/@svelte/components';
	import * as Avatar from '@/components/ui/avatar';
	import { _ } from '@services';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;
</script>

{#await data.organizationDetails}
	<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
{:then organizationDetails}
	<header class="space-y-6 mb-6">
		<Link href="/admin/organizations">{$_('admin-pages.organizations.back-to-overview')}</Link>
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

	<slot />
{:catch error}
	<p>{error.message}</p>
{/await}
