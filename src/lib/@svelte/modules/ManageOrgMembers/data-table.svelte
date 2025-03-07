<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _, locale } from '@services';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import { goto, invalidate } from '$app/navigation';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '@/utils/tailwind';
	import type { OrganizationMembership } from 'svelte-clerk/server';
	import { dayjs } from '@services/i18n';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import SuperDebug from 'sveltekit-superforms';
	import { page } from '$app/stores';
	export let inviteMemberDialogOpen;
	export let memberResponse: { data: OrganizationMembership[]; totalCount: number };
	import * as Select from "$lib/components/ui/select";
	import { SearchInput } from '@/@svelte/components';
	dayjs.extend(relativeTime);

	let table = createTable(readable(memberResponse.data), {
		page: addPagination({
			serverSide: true,
			serverItemCount: writable(memberResponse.totalCount),
			initialPageIndex: $page.url.searchParams.get('page')
				? Number($page.url.searchParams.get('page'))
				: undefined,
			initialPageSize: $page.url.searchParams.get('limit')
				? Number($page.url.searchParams.get('limit'))
				: undefined		}),
		sort: addSortBy({
			serverSide: true,
			initialSortKey: $page.url.searchParams.get('sort') ? decodeURIComponent($page.url.searchParams.get('sort')!) : undefined
		}),
		filter: addTableFilter({
			serverSide: true,
			initialFilterValue: $page.url.searchParams.get('filter') || undefined,
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	let columns = table.createColumns([
		table.column({
			accessor: ({ publicUserData }) => [`${publicUserData?.firstName} ${publicUserData?.lastName}`, publicUserData.imageUrl],
			id: 'user-profile',
			header: '',
			cell: ({ value: [userName, imageUrl] }) => {
				return createRender(DataTableUserIcon, {
					src: imageUrl,
					userName: userName
				});
			}
		}),
		table.column({
			accessor: ({ publicUserData }) => publicUserData?.firstName ?? "",
			id: 'first_name',
			header: $_('table-headings.firstName')
		}),

		table.column({
			accessor: ({ publicUserData }) => publicUserData?.lastName ?? "",
			id: 'last_name',
			header: $_('table-headings.lastName')
		}),

		table.column({
			accessor: ({ publicUserData }) => publicUserData?.identifier,
			id: 'email_address',
			header: $_('table-headings.emailAddress')

		}),
		table.column({
			accessor: item => item.role,
			id: 'role',
			header: $_('table-headings.role'),
			cell: ({ value }) => {
				if (value == 'org:owner') {
					return $_('modules.manage-org-members.owner');
				} else if (value == 'org:member') {
					return $_('modules.manage-org-members.member');
				} else if (value == 'org:admin') {
					return $_('modules.manage-org-members.admin');
				} else {
					return value;
				}
			}
		}),
		table.column({
			accessor: item => item.createdAt,
			id: 'createdAt',
			header: $_('table-headings.joined'),
			cell: ({ value }) => dayjs(value, { locale: $locale }).fromNow()
		}),
		table.column({
			accessor: ({ publicUserData }) => publicUserData?.userId,
			header: '',
			cell: () => {
				return createRender(DataTableActions);
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex, pageSize } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { sortKeys } = pluginStates.sort;

	let timeout = null;

	filterValue.subscribe(value => {
		if (value === "" && $page.url.searchParams.get('filter') === null) return;
		if ($page.url.searchParams.get('filter') === value) return;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(async () => {
			const q = new URLSearchParams($page.url.searchParams);
			q.set('filter', value);
			goto(`?${q}`, { noScroll: true});
		}, 600
		)
	})

	sortKeys.subscribe(value => {
		if (value.length) {
			const q = new URLSearchParams($page.url.searchParams);
			q.set('sort', (value[0].order === 'asc' ? '+' : '-') + value[0].id);
			goto(`?${q}`, { noScroll: true});
		}
	})

	function nextPage() {
		console.log($pageIndex);

		$pageIndex = $pageIndex + 1;
		const q = new URLSearchParams($page.url.searchParams);
		q.set("page", $pageIndex.toString());
		goto(`?${q}`, { noScroll: true});
	}

	function previousPage() {
		$pageIndex = $pageIndex - 1;
		const q = new URLSearchParams($page.url.searchParams);
		q.set("page", $pageIndex.toString());
		goto(`?${q}`, { noScroll: true});
	}

	const pageSizes = [10, 20, 50, 100];
	$: selectedPageSize = $pageSize
		? {
			label: String($pageSize),
			value: $pageSize
		}
		: undefined;
	pageSize.subscribe(value => {
		const q = new URLSearchParams($page.url.searchParams);
		q.set("limit", String(value));
		goto(`?${q}`, { noScroll: true});
	})
	</script>

<div class={cn(`space-y-4`, $$props.class)}
		 {...$$restProps}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput
			class="max-w-sm"
			placeholder={$_('common.search')}
			type="text"
			bind:value={$filterValue}
		/>
		<Button variant="outline" on:click={() => (inviteMemberDialogOpen = true)}
		>{$_('modules.manage-org-members.invite')}</Button
		>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs} class="w-full whitespace-no-wrap">
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-sm font-normal">
										{#if cell.id === 'first_name' ||cell.id === 'last_name' || cell.id === 'email_address'}
											<Button class="px-0" variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs} class="bg-white divide-y">
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4">
		<div class="min-w-min">
			<Select.Root bind:selected={selectedPageSize} onSelectedChange={(v) => {
         pageSize.set(v.value);
        }}>
				<Select.Trigger>
					{selectedPageSize.label}
				</Select.Trigger>
				<Select.Content>
					{#each pageSizes as size}
						<Select.Item label={String(size)} value={size}>
							{size}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={previousPage}
			disabled={!$hasPreviousPage}
		>{$_("common.previous")}
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={nextPage}
		>{$_("common.next")}
		</Button>
	</div>
</div>