// utils/formData.ts
export type Primitive = string | number | boolean | null | undefined;
export type FormDataValue =
	| Primitive
	| Date
	| File
	| Blob
	| FormDataValue[]
	| { [k: string]: FormDataValue };

export type FormDataOptions = {
	/**
	 * When true uses indexed array keys like "arr[0]"; when false uses "arr[]".
	 * Default: false (use arr[]).
	 */
	useIndices?: boolean;
	/**
	 * Callback to convert specific non-file values (e.g. Date -> ISO).
	 */
	valueConverter?: (val: Exclude<Primitive | Date, undefined>) => string;
};

function isFileLike(v: any): v is File | Blob {
	return v instanceof File || v instanceof Blob;
}

function isDate(v: any): v is Date {
	return v instanceof Date;
}

/**
 * Append object to FormData recursively.
 */
export function toFormData(input: FormDataValue, opts: FormDataOptions = {}): FormData {
	const { useIndices = false, valueConverter } = opts;
	const fd = new FormData();

	const defaultConverter = (v: Exclude<Primitive | Date, undefined>) => {
		if (isDate(v)) return (v as Date).toISOString();
		if (v === null) return ''; // represent null as empty string (adjust if desired)
		return String(v);
	};

	const converter = (val: any) => (valueConverter ? valueConverter(val) : defaultConverter(val));

	function append(key: string, value: any) {
		if (value === undefined) {
			// skip undefined by default (you can change to append empty string if desired)
			return;
		}
		if (value === null) {
			fd.append(key, converter(null));
			return;
		}
		if (isFileLike(value)) {
			fd.append(key, value);
			return;
		}
		if (isDate(value)) {
			fd.append(key, converter(value));
			return;
		}
		if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
			fd.append(key, converter(value));
			return;
		}
		// For objects/arrays we should never hit here; handled in build below
	}

	function build(prefix: string | null, obj: any) {
		if (obj === undefined) {
			return;
		}
		if (
			obj === null ||
			typeof obj === 'string' ||
			typeof obj === 'number' ||
			typeof obj === 'boolean' ||
			isDate(obj) ||
			isFileLike(obj)
		) {
			// primitive or file/date => append directly
			if (prefix === null) {
				throw new Error('FormData top-level primitive must have a key');
			}
			append(prefix, obj);
			return;
		}

		if (Array.isArray(obj)) {
			// array: iterate items and add keys with [] or [index]
			obj.forEach((item, index) => {
				const key = prefix + (useIndices ? `[${index}]` : `[]`);
				if (
					item === null ||
					typeof item === 'string' ||
					typeof item === 'number' ||
					typeof item === 'boolean' ||
					isDate(item) ||
					isFileLike(item)
				) {
					append(key, item);
				} else {
					// nested object inside array: use index form to preserve structure
					// e.g. items[0][name]=... or items[][name]=... (the latter ambiguous sometimes)
					const nextPrefix = useIndices ? `${prefix}[${index}]` : `${prefix}[]`;
					build(nextPrefix, item);
				}
			});
			return;
		}

		// object
		Object.keys(obj).forEach((prop) => {
			const value = obj[prop];
			const key = prefix ? `${prefix}[${prop}]` : prop;
			build(key, value);
		});
	}

	build(null, input);
	return fd;
}
