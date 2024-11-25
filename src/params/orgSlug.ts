export function match(param) {
	const regex = /^[\w-]+-[a-zA-Z0-9]{8}$/;
	return regex.test(param);
}
