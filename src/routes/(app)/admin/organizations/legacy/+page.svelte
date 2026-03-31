<script lang="ts">
	import { _ } from '@services';
	import LegacyOrganizationsDataTable from './legacy-organizations-data-table.svelte';
	import { getLegacyOrgs } from '@/remote/functions/admin';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import { Input } from '@/components/ui/input';
	import { fade } from 'svelte/transition';
	import BulkImportLegacyOrgDialog from './bulk-import-legacy-org-dialog.svelte';
	import { Button } from '@/components/ui/button';
	import type { Snapshot } from './$types';
	import { page } from '$app/state';
	import * as InputGroup from '@/components/ui/input-group';
	import { SearchIcon, X } from '@lucide/svelte';

	let params = queryParameters(
		{
			page: ssp.number(0),
			limit: ssp.number(20),
			query: ssp.string(''),
			sortBy: ssp.string(),
			sortDirection: ssp.string()
		},
		{
			showDefaults: false,
			debounceHistory: 300,
			pushHistory: true
		}
	);

	let filters = $derived.by(() => ({
		page: params.page,
		size: params.limit,
		sortBy: params.sortBy ?? 'name',
		sortDirection: params.sortDirection ?? 'asc',
		query: params.query
	}));

	let query = $derived(getLegacyOrgs(filters));
	let importBulkOrgDialogOpen = $state(false);

	export const snapshot: Snapshot<{
		query: string;
		page: number;
		limit: number;
		sortBy: string | null;
		sortDirection: 'asc' | 'desc' | null;
	}> = {
		capture: () => ({
			query: params.query,
			page: params.page,
			limit: params.limit,
			sortBy: params.sortBy,
			sortDirection: params.sortDirection as 'asc' | 'desc'
		}),
		restore: (value) => {
			params.query = value.query;
			params.page = value.page;
			params.limit = value.limit;
			params.sortBy = value.sortBy;
			params.sortDirection = value.sortDirection;
		}
	};
</script>

<div in:fade>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.organizations.legacy.title')}
		</h1>
	</section>
	<section class="mt-2">
		<h4 class=" text-stone-500 text-balance w-[60ch]">
			{$_('admin-pages.organizations.legacy.description')}
		</h4>
	</section>
	<section class="mt-6 flex gap-x-2 items-center">
		<InputGroup.Root class="max-w-sm">
			<InputGroup.Input
				placeholder={$_('common.search')}
				type="search"
				bind:value={params.query}
				minlength={3}
			/>
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button
					class="cursor-pointer appearance-none hover:bg-transparent hover:text-current border-none opacity-50 hover:opacity-100 transition-opacity"
					disabled={params.query === ''}
					onclick={() => (params.query = '')}
					>
					<X />
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
		<div class="grow"></div>
		<BulkImportLegacyOrgDialog bind:open={importBulkOrgDialogOpen} />
		<Button onclick={() => (importBulkOrgDialogOpen = true)}>
			{$_('admin-pages.organizations.importBulkOrganizations')}
		</Button>
	</section>
	<LegacyOrganizationsDataTable
		isLoading={query.loading}
		organizations={query.current?.organizations ?? []}
		totalCount={query.current?.totalElements || 0}
		bind:page={params.page}
		bind:limit={params.limit}
		bind:sortBy={params.sortBy}
		bind:sortDirection={
			() => params.sortDirection as 'asc' | 'desc',
			(value) => {
				params.sortDirection = value;
			}
		}
	/>
</div>
