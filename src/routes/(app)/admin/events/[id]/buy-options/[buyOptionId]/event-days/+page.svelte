<script lang="ts">
	import { _ } from '@services';
	import { changeAllowedSignUpDays, deleteBuyOptionEventDay } from '@/remote/functions/admin';
	import BuyOptionEventDays from './buy-option-event-days.svelte';
	import { GetEventBuyOptionOutput } from '@api/admin-client';
	import { toast } from 'svelte-sonner';
	import { getContext } from 'svelte';
	import type { RemoteQuery } from '@sveltejs/kit';

	let { params } = $props();
	let eventId = params.id;
	let buyOptionId = params.buyOptionId;

	// Use the shared query instance from the layout
	let getBuyOptionQuery = getContext<RemoteQuery<GetEventBuyOptionOutput>>('sharedBuyOptionQuery');
</script>

{#if getBuyOptionQuery.loading}
	<div class="col-span-2">
		<p class="text-center text-muted-foreground">{$_('common.loading')}...</p>
	</div>
{/if}

<BuyOptionEventDays
	{eventId}
	{buyOptionId}
	version={getBuyOptionQuery.current?.version ?? 0}
	eventDays={getBuyOptionQuery.current?.eventDays ?? []}
	allowedSignUpDays={getBuyOptionQuery.current?.allowedSignUpDays ?? 1}
	onDelete={async ({ eventDayId }) => {
		await deleteBuyOptionEventDay({
			eventId,
			buyOptionId,
			eventDayId,
			version: getBuyOptionQuery.current?.version ?? 0
		}).updates(
			getBuyOptionQuery.withOverride((prev) => {
				return {
					...prev,
					eventDays: prev.eventDays?.filter((ed) => ed.id !== eventDayId),
					version: (prev.version ?? 0) + 1
				};
			})
		);
	}}
	onCreate={async ({ data, submit }) => {
		await submit().updates(
			getBuyOptionQuery.withOverride((prev) => {
				return {
					...prev,
					eventDays: [
						...((prev.eventDays as GetEventBuyOptionOutput['eventDays']) || []),
						{
							dayDate: data.date!,
							totalCapacity: data.totalCapacity!,
							remainingCapacity: data.totalCapacity!,
							id: crypto.randomUUID() // Temporary ID until real one is returned from backend
						}
					],
					version: (prev.version ?? 0) + 1
				};
			})
		);
	}}
	onChangeAllowedSignUpDays={async ({ allowedSignUpDays }) => {
		try {
			await changeAllowedSignUpDays({
				eventId,
				buyOptionId,
				allowedSignUpDays: Number(allowedSignUpDays),
				version: getBuyOptionQuery.current?.version ?? 0
			}).updates(
				getBuyOptionQuery.withOverride((prev) => {
					return {
						...prev,
						allowedSignUpDays: Number(allowedSignUpDays),
						version: (prev.version ?? 0) + 1
					};
				})
			);
		} catch (error) {
			console.error('Error changing allowed sign-up days:', error);
			toast.error($_('admin-pages.events.buy-options.change-allowed-sign-up-days-error'), {
				action: {
					label: $_('common.reload'),
					onClick: async () => {
						await getBuyOptionQuery.refresh();
					}
				}
			});
			throw error;
		}
	}}
	onEdit={async ({ data, submit }) => {
		await submit().updates(
			getBuyOptionQuery.withOverride((prev) => {
				return {
					...prev,
					eventDays: prev.eventDays?.map((ed) =>
						ed.id === data.eventDayId
							? {
									...ed,
									dayDate: data.date!,
									totalCapacity: data.totalCapacity!,
									remainingCapacity:
										ed.remainingCapacity! + (data.totalCapacity! - ed.totalCapacity!)
								}
							: ed
					),
					version: (prev.version ?? 0) + 1
				};
			})
		);
	}}
/>
