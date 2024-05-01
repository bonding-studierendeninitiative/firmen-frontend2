import type { SafeParseReturnType } from 'zod';

interface ErrorItem {
	field: string;
	message: string;
}

export const formatZodErrors = (data: SafeParseReturnType<any, any>) => {
	const errors = data?.error?.errors.map((error) => {
		return {
			field: error.path.join('.'),
			message: error.message
		};
	});
	return convertArrayToObject(errors);
};

const convertArrayToObject = (errors: ErrorItem[] | undefined) => {
	if (!errors) return;
	const result: Record<string, any> = {};
	errors.forEach((item) => {
		const fields = item.field.split('.');
		let nestedObject: Record<string, any> = result;
		fields.forEach((field, index) => {
			if (index === fields.length - 1) {
				nestedObject[field] = item.message;
			} else {
				nestedObject[field] = nestedObject[field] || {};
				nestedObject = nestedObject[field];
			}
		});
	});
	return result;
};
