<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		ActionNotificationItem,
		GradientButton,
		Link,
		Modal,
		Select
	} from '$lib/@svelte/components';
	import { FilledCheckIcon, PlusIcon } from '$lib/@svelte/icons';
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
	let isSuccessModalOpen = false;
	let isUpdatePortraitModalOpen = false;
	const handleUpdatePortrait = (id: number) => {
		isUpdatePortraitModalOpen = true;
	};
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
				handleUpdatePortrait={() => handleUpdatePortrait(id)}
				notificationContent={content}
				notificationDate={date}
				notificationType={type}
			/>
		{/each}
	</div>
</section>
<Modal bind:isOpen={isUpdatePortraitModalOpen}>
	<div class=" flex flex-col justify-center items-center">
		<div class=" text-start">
			<h2 class=" text-stone-950 font-extrabold text-base">Add Portrait</h2>
			<p class="mt-2 text-stone-500 text-base">
				Please select any one of your portraits for this event <span class=" text-stone-900"
					>Tech Foundation 2023</span
				> process this forward for our team to review and verify.
			</p>
		</div>
		<div class="my-6 w-full">
			<Select placeholder="Select Portrait"></Select>
			<div class=" w-full flex justify-start items-center">
				<Link classes=" flex items-center !font-semibold mt-4" onClick={() => goto('/portraits')}
					><PlusIcon classes="mr-2" />New Portrait</Link
				>
			</div>
		</div>
	</div>
	<footer class=" flex items-center justify-end">
		<GradientButton
			classes="!py-1.5"
			onClick={() => {
				isSuccessModalOpen = true;
				isUpdatePortraitModalOpen = false;
			}}>Update</GradientButton
		>
	</footer>
</Modal>
<Modal bind:isOpen={isSuccessModalOpen}>
	<div class=" flex flex-col justify-center items-center">
		<p class=" text-xl"><FilledCheckIcon /></p>
		<div class=" my-6 text-center">
			<h2 class=" text-stone-950 font-extrabold text-base">Portrait Updated</h2>
			<p class="mt-2 text-stone-500 text-base">
				Thank you for updating your portrait for this event. You can review your details on events
				page.
			</p>
		</div>
	</div>
	<footer class=" flex items-center justify-center">
		<GradientButton classes="!py-1.5" onClick={() => goto('/events')}>View Events</GradientButton>
	</footer>
</Modal>
