<script lang="ts">
	import { Table, Button } from '$lib/@svelte/components';
	import { CompanyDetails } from '$lib/@svelte/modules';

	const columns = ['Company', 'Contact Person', 'Number', 'Email Address', 'Bookings', ''];

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
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">All Companies</h1>
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
						><Button classes=" !py-1.5 !px-4 " onClick={() => (isDrawerOpen = true)}
							>View Details</Button
						></td
					>
				</tr>
			{/each}
		</Table>
	</section>
</div>
<CompanyDetails isOpen={isDrawerOpen} />
