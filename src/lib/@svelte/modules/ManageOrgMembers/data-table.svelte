<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _, locale } from '@services';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '@/utils/tailwind';
	import type { OrganizationMembership } from 'svelte-clerk/server';
	import { dayjs } from '@services/i18n';
	import relativeTime from 'dayjs/plugin/relativeTime';

	export let inviteMemberDialogOpen;
	export let memberResponse: { data: OrganizationMembership[]; totalCount: number };

	dayjs.extend(relativeTime);

	console.info(`Rendering org members data table:`, memberResponse.data);

	let table = createTable(readable(memberResponse.data), {
		page: addPagination({
			serverSide: true,
			serverItemCount: writable(memberResponse.totalCount)
		}),
		sort: addSortBy(),
		filter: addTableFilter({
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
			accessor: ({ publicUserData }) => publicUserData?.firstName + ' ' + publicUserData?.lastName,
			id: 'user-profile-name',
			header: 'Name'
		}),
		table.column({
			accessor: ({ publicUserData }) => publicUserData?.identifier,
			id: 'email',
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
</script>

<div class={cn(`space-y-4`, $$props.class)}
		 {...$$restProps}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<Input
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
										{#if cell.id === 'user-profile-name' || cell.id === 'role' || cell.id === 'email'}
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
										{#if cell.id !== 'contactPersonName' && cell.id !== 'membershipType' && cell.id !== 'email'}
											<div class="pr-0 mr-0 flex justify-end">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
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
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>{$_("common.previous")}
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}
		>{$_("common.next")}
		</Button>
	</div>
</div>