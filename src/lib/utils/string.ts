export function hasMaxFiveLines(input: string): boolean {
	const lines = input.split('\n');
	return lines.length <= 5;
}
