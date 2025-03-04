export function makeSerializable<T>(obj: T): MakeSerializable<T> {
	// Return the value if it's null or not an object (primitives)
	if (obj === null || typeof obj !== 'object') {
		return obj as MakeSerializable<T>;
	}

	// If the obj is a Date, create a new Date instance or convert to ISO string
	if (obj instanceof Date) {
		return new Date(obj.getTime()) as MakeSerializable<T>;
		// If you prefer, you could also return: obj.toISOString();
	}

	// If the obj is an Array, map each element recursively.
	if (Array.isArray(obj)) {
		return obj.map((item) => makeSerializable(item)) as MakeSerializable<T>;
	}

	// Otherwise, it's an object.
	// Create a new object without any prototype to avoid inherited properties.
	const plainObj: { [key: string]: any } = Object.create(null);

	// Use Object.keys to iterate only over own enumerable properties.
	for (const key of Object.keys(obj)) {
		const value = (obj as any)[key]; // Use type assertion here
		// Skip functions
		if (typeof value === 'function') {
			continue;
		}
		// Assign the recursive conversion of the value.
		plainObj[key] = makeSerializable(value);
	}

	return plainObj as MakeSerializable<T>;
}

// Recursive type definition
type MakeSerializable<T> = T extends Date
	? Date
	: T extends (infer U)[]
		? MakeSerializable<U>[]
		: T extends object
			? { [K in keyof T as T[K] extends Function ? never : K]: MakeSerializable<T[K]> }
			: T;
