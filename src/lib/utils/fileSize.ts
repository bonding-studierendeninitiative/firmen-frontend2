export function getHumanReadableFileSize(size: number, si: boolean = true) {
	const thresh = si ? 1000 : 1024;
	if (Math.abs(size) < thresh) {
		return size + ' B';
	}
	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	do {
		size /= thresh;
		++u;
	} while (Math.abs(size) >= thresh && u < units.length - 1);
	return size.toFixed(1) + ' ' + units[u];
}
