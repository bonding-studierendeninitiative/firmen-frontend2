<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		length?: number;
		value?: string;
		onValueChange?: (value: string) => void;
		onComplete?: (value: string) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		length = 6,
		value = '',
		onValueChange,
		onComplete,
		disabled = false,
		class: className
	}: Props = $props();

	let inputs: HTMLInputElement[] = [];
	let digits = $state<string[]>(Array(length).fill(''));

	// Update digits when value prop changes
	$effect(() => {
		const newDigits = value.split('').slice(0, length);
		while (newDigits.length < length) {
			newDigits.push('');
		}
		digits = newDigits;
	});

	function updateValue() {
		const newValue = digits.join('');
		onValueChange?.(newValue);

		if (newValue.length === length && newValue.replace(/\s/g, '').length === length) {
			onComplete?.(newValue);
		}
	}

	function handleInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = target.value.replace(/[^0-9]/g, '');

		if (newValue.length <= 1) {
			digits[index] = newValue;
			updateValue();

			// Move to next input if value entered
			if (newValue && index < length - 1) {
				inputs[index + 1]?.focus();
			}
		} else {
			// Handle paste of multiple digits
			const pastedDigits = newValue.split('').slice(0, length - index);
			for (let i = 0; i < pastedDigits.length && index + i < length; i++) {
				digits[index + i] = pastedDigits[i];
			}
			updateValue();

			// Focus the next empty input or the last input
			const nextIndex = Math.min(index + pastedDigits.length, length - 1);
			inputs[nextIndex]?.focus();
		}
	}

	function handleKeyDown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace' && !digits[index] && index > 0) {
			// Move to previous input if current is empty
			inputs[index - 1]?.focus();
		} else if (event.key === 'ArrowLeft' && index > 0) {
			inputs[index - 1]?.focus();
		} else if (event.key === 'ArrowRight' && index < length - 1) {
			inputs[index + 1]?.focus();
		}
	}

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const pastedData = event.clipboardData?.getData('text/plain') || '';
		const pastedDigits = pastedData
			.replace(/[^0-9]/g, '')
			.split('')
			.slice(0, length);

		for (let i = 0; i < length; i++) {
			digits[i] = pastedDigits[i] || '';
		}
		updateValue();
	}
</script>

<div class={cn('flex items-center gap-2', className)}>
	{#each digits as digit, index}
		<input
			bind:this={inputs[index]}
			type="text"
			inputmode="numeric"
			maxlength="1"
			value={digit}
			{disabled}
			class={cn(
				'flex h-9 w-9 items-center justify-center border border-input rounded-md text-center text-sm',
				'focus:outline-none focus:ring-1 focus:ring-ring',
				'disabled:cursor-not-allowed disabled:opacity-50',
				digit ? 'border-primary' : 'border-input'
			)}
			oninput={(e) => handleInput(index, e)}
			onkeydown={(e) => handleKeyDown(index, e)}
			onpaste={handlePaste}
		/>
	{/each}
</div>
