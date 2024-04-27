<script lang="ts">
	import { _ } from '@services';
	import { Table, Button } from '$lib/@svelte/components';
	import { CompanyDetails } from '$lib/@svelte/modules';

	const columns = ['company', 'contactPerson', 'number', 'emailAddress', 'bookings', ''];

	const eventList = [
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '5'
		},
		{
			company: 'Facebook',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '4'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '2'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '9'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '36'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '15'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '5'
		},
		{
			company: 'Facebook',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '4'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '2'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '9'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '36'
		},
		{
			company: 'Google Inc',
			contactPerson: 'John McDonald',
			number: '+01 0000 0000 00',
			email: 'john@company.com',
			bookings: '15'
		}
	];

	let isDrawerOpen: boolean = false;

	const handleViewDetails = (index: number) => {
		isDrawerOpen = true;
	};
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.companies.allCompanies')}
		</h1>
	</section>
	<section class=" mt-10">
		<Table totalRecords={9} {columns}>
			{#each eventList as { company, contactPerson, number, email, bookings }, index}
				<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
					<td class=" px-6 py-4 text-grey-900 text-sm">{company}</td>
					<td class=" px-6 py-4 text-grey-900 text-sm">{contactPerson}</td>
					<td class=" px-6 py-4 text-grey-500 text-sm">{number}</td>
					<td class=" px-6 py-4 text-grey-500 text-sm">{email}</td>
					<td class=" px-6 py-4 text-grey-500 text-sm">{bookings}</td>
					<td class=" px-6 py-4"
						><Button classes=" !py-1.5 !px-4 " onClick={() => handleViewDetails(index)}
							>{$_('common.viewDetails')}</Button
						></td
					>
				</tr>
			{/each}
		</Table>
	</section>
</div>
<CompanyDetails bind:isOpen={isDrawerOpen} />
