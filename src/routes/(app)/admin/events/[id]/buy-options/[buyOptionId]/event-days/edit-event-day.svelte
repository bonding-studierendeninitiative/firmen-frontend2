<script lang="ts">
	import { _ } from '@services';
	import { updateBuyOptionEventDay } from '@/remote/functions/admin';
	import * as Dialog from '@/components/ui/dialog';
	import { Eye } from '@lucide/svelte';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';
	import type { RemoteQuery, RemoteQueryOverride } from '@sveltejs/kit';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Progress } from '@/components/ui/progress';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import type { InferOutput } from 'valibot';
	import type { UpdateEventDayInput } from '@schema';

	interface Props {
		eventId: string;
		buyOptionId: string;
		day: Exclude<GetEventBuyOptionOutput['eventDays'], undefined>[number];
		version: number;
		onEdit?: ({
			data,
			submit,
			form
		}: {
			data: InferOutput<UpdateEventDayInput>;
			submit: () => Promise<void> & {
				updates: (...queries: Array<RemoteQuery<any> | RemoteQueryOverride>) => Promise<void>;
			};
			form: HTMLFormElement;
		}) => Promise<void>;
	}

	let { eventId, buyOptionId, day, version, onEdit }: Props = $props();
	let editForm = updateBuyOptionEventDay.for(day.id!);

	let open = $state(false);

	// Calculate capacity percentage
	function calculateCapacityPercentage(day: {
		totalCapacity?: number;
		remainingCapacity?: number;
	}): number {
		return Math.round(
			((Number(day.totalCapacity) - Number(day.remainingCapacity)) / Number(day.totalCapacity)) *
				100
		);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} type="button">
		<Eye class="size-4" />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[500px]">
		<form
			{...editForm.enhance(async ({ submit, form, data }) => {
				await onEdit?.({
					data,
					submit,
					form
				});

				form.reset();
				open = false;
			})}
		>
			<input {...editForm.fields.eventId.as('hidden', eventId)} />
			<input {...editForm.fields.buyOptionId.as('hidden', buyOptionId)} />
			<input {...editForm.fields.eventDayId.as('hidden', day.id!)} />
			<input {...editForm.fields.version.as('number')} value={version} type="hidden" />
			<Dialog.Header>
				<Dialog.Title>Edit Event Day</Dialog.Title>
				<Dialog.Description>Configure the event day details and capacity.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="eventDate">Event Date</Label>
					<Input id="eventDate" {...editForm.fields.date.as('date')} value={day.dayDate} />
				</div>
				<div class="grid gap-2">
					<Label for="totalCapacity">Total Capacity</Label>
					<Input
						id="totalCapacity"
						{...editForm.fields.totalCapacity.as('number')}
						bind:value={
							() => editForm.fields.totalCapacity.value() ?? day.totalCapacity,
							editForm.fields.totalCapacity.set
						}
					/>
					<p class="text-sm text-muted-foreground">
						Maximum number of organizations that can participate on this day
					</p>
				</div>
				<div class="mt-2">
					<div class="text-sm mb-2">Capacity Usage</div>
					<Progress
						value={calculateCapacityPercentage({
							totalCapacity: editForm.fields.totalCapacity.value() ?? day.totalCapacity,
							remainingCapacity: day.remainingCapacity
						})}
						class="h-2"
					/>
					<div class="flex justify-between text-sm mt-1">
						<span
							>{Number(editForm.fields.totalCapacity.value() ?? day.totalCapacity) -
								Number(day.remainingCapacity)}
							booked</span
						>
						<span class="text-muted-foreground"
							>{day.remainingCapacity}
							remaining</span
						>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Dialog.Close type="button">
					{$_('common.cancel')}
				</Dialog.Close>
				<Button type="submit">{$_('common.save')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
