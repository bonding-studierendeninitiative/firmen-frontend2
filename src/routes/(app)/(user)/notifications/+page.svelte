<script lang="ts">
	import { ActionNotificationItem } from '$lib/@svelte/components';
	interface NotificationsType {
		id: number;
		content: string;
		date: any;
		type: 'registrationSuccess' | 'registrationRejected' | 'simpleNotification';
	}

	const notifications: NotificationsType[] = [
		{
			id: 1,
			content: 'You have registered for an event in <b>Tech Foundation 2023</b> on 22 Dec 2023',
			date: new Date(),
			type: 'simpleNotification'
		},
		{
			id: 2,
			content:
				'You registration for <b>Tech Foundation 2023</b> has been approved. Please select your portrait for the event and update your event information.',
			date: new Date(),
			type: 'registrationSuccess'
		},
		{
			id: 3,
			content:
				'You registration for <b>Tech Foundation 2023</b> have been rejected. Please try again or contact our team.',
			date: new Date(),
			type: 'registrationRejected'
		},
		{
			id: 4,
			content: 'You have registered for an event in <b>Tech Foundation 2023</b> on 22 Dec 2023',
			date: new Date(),
			type: 'simpleNotification'
		},
		{
			id: 5,
			content:
				'You registration for <b>Tech Foundation 2023</b> has been approved. Please click the button below to process to your payment link.',
			date: new Date(),
			type: 'registrationSuccess'
		}
	];
</script>

<section>
	<h1 class=" text-stone-950 text-3xl font-extrabold">Notifications</h1>
</section>
<section class="mt-10 mb-4">
	<div class="mb-6 flex justify-center items-center">
		<hr class=" border-stone-200 w-full" />
		<p class=" whitespace-nowrap mx-8 text-sm text-stone-400 font-medium">22 December 2023</p>
		<hr class=" border-stone-200 w-full" />
	</div>
	<div>
		{#each notifications as { id, content, date, type }}
			<ActionNotificationItem
				notificationContent={content}
				notificationDate={date}
				notificationType={type}
			/>
		{/each}
	</div>
</section>
