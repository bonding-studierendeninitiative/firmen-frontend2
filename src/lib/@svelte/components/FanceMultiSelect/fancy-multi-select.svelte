<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import * as Command from '@/components/ui/command';
	import { X } from '@lucide/svelte';

	type Option = Record<'value' | 'label', string>;

    interface Props {
        options: Option[];
        selected: Option[];
        placeholder: string;
    }

    let {options, selected = $bindable(), placeholder}: Props = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let open = $state(false);
	// let selected = $state<SvelteSet<Option>>(new SvelteSet());
	let inputValue = $state('');

	function handleUnselect(option: Option) {
        let original = new Set(selected)
        original.delete(option)
        selected = [...original]
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (inputRef) {
			// This is not a default behaviour of the <input /> field
			if (e.key === 'Escape') {
				inputRef.blur();
			}
		}
	}

	const selectables = $derived(options.filter((option) => !selected.includes(option)));
</script>

<Command.Root onkeydown={handleKeyDown} class="overflow-visible bg-transparent">
	<div
		class="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
	>
		<div class="flex flex-wrap gap-1">
			{#each selected as selectedItem}
				<Badge variant="secondary">
					{selectedItem.label}
					<button
						class="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								handleUnselect(selectedItem);
							}
						}}
						onmousedown={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onclick={(e) => {e.preventDefault();handleUnselect(selectedItem)}}
					>
						<X class="h-3 w-3 text-muted-foreground hover:text-foreground" />
					</button>
				</Badge>
			{/each}

			<Command.Input
				ref={inputRef}
				bind:value={inputValue}
				onblur={() => (open = false)}
				onfocus={() => (open = true)}
				{placeholder}
				class="ml-2 flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground"
			/>
		</div>
	</div>
	<div class="relative mt-2">
		<Command.List>
			{#if open && selectables.length > 0}
				<div
                    class="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in max-h-64 overflow-auto"
				>
					<Command.Group class="h-full overflow-auto">
						{#each selectables as selectable}
							<Command.Item
								value={selectable.value}
								onmousedown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onSelect={() => {
									inputValue = '';
									selected = [...selected, selectable];
								}}
								class={'cursor-pointer'}
							>
								{selectable.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</div>
			{/if}
		</Command.List>
	</div>
</Command.Root>
