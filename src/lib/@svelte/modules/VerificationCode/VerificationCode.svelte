<script lang="ts">
	import { goto } from '$app/navigation';

	let pins = ['', '', '', '', ''];

	let pinInputRefs: any = [null, null, null, null, null];

	const handleInput = (event: any, index: number) => {
		const key = event.target?.value;
		if (key !== '') {
			let pinsCopy = [...pins];
			pinsCopy[index] = key[key.length - 1];
			pins = pinsCopy;
			if (index === pins.length - 1) {
				handleSubmit();
			}
			pinInputRefs[index + 1].focus();
		} else {
			let pinsCopy = [...pins];
			pinsCopy[index] = '';
			pins = pinsCopy;
			pinInputRefs[index - 1].focus();
			console.log({ pins, key, index });
		}
	};
	const handleKeyPress = (e: any, index: number) => {
		const key = e.key;
		if (key === 'Backspace' && !pins[index]) {
			pinInputRefs[index - 1].focus();
		}
	};
	const handleSubmit = () => {
		goto('/reset-password');
	};
</script>

<div class=" flex justify-between mb-12">
	{#each pins as pin, index (index)}
		<input
			type="number"
			value={pin}
			bind:this={pinInputRefs[index]}
			on:input={(e) => {
				handleInput?.(e, index);
			}}
			on:keydown={(e) => handleKeyPress(e, index)}
			class={' w-14 rounded-lg text-center  border border-solid border-gray-300 bg-white shadow-md flex p-2  items-center gap-2 focus:outline-none focus:ring focus:border-blue-500'}
		/>
	{/each}
</div>
