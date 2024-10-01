<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import {
		ActionNotificationItem,
		Link,
		Modal,
		Select
	} from '@/@svelte/components';
	import { FilledCheckIcon, PlusIcon } from '@/@svelte/icons';
	import { Button } from '@/components/ui/button';

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
	<h1 class=" text-stone-950 text-3xl font-extrabold">
		{$_('user-pages.notifications.notifications')}
	</h1>
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
			<h2 class=" text-stone-950 font-extrabold text-base">
				{$_('user-pages.notifications.addPortrait')}
			</h2>
			<p class="mt-2 text-stone-500 text-base">
				{$_('user-pages.notifications.pleaseSelectPortrait')}
				<span class=" text-stone-900">Tech Foundation 2023</span>
				{$_('user-pages.notifications.processThisForward')}
			</p>
		</div>
		<div class="my-6 w-full">
			<Select placeholder={$_('user-pages.notifications.selectPortrait')}></Select>
			<div class=" w-full flex justify-start items-center">
				<Link href="/portraits" class=" flex items-center !font-semibold mt-4">
					<PlusIcon classes="mr-2" />
					{$_('user-pages.notifications.newPortrait')}
				</Link>
			</div>
		</div>
	</div>
	<footer class=" flex items-center justify-end">
		<Button
			class="!py-1.5"
			variant="gradient" on:click={() => {
				isSuccessModalOpen = true;
				isUpdatePortraitModalOpen = false;
			}}>
			{$_('common.update')}
		</Button>
	</footer>
</Modal>
<Modal bind:isOpen={isSuccessModalOpen}>
	<div class=" flex flex-col justify-center items-center">
		<p class=" text-xl">
			<FilledCheckIcon />
		</p>
		<div class=" my-6 text-center">
			<h2 class=" text-stone-950 font-extrabold text-base">
				{$_('user-pages.notifications.portraitUpdated')}
			</h2>
			<p class="mt-2 text-stone-500 text-base">
				{$_('user-pages.notifications.portraitUpdatedNote')}
			</p>
		</div>
	</div>
	<footer class=" flex items-center justify-center">
		<Button class="!py-1.5" variant="gradient" on:click={() => goto('/events')}>
			{$_('common.viewEvents')}
		</Button>
	</footer>
</Modal>
