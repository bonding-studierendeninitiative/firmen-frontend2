import type { SafeParseReturnType } from 'zod';

// eslint-disable-next-line
export const formatZodErrors: any = (data: SafeParseReturnType<any, any>) => {
	const errors = data?.error?.errors.map((error) => {
		return {
			field: error.path[0],
			message: error.message
		};
	});
	return convertArrayToObject(errors);
};

// eslint-disable-next-line
const convertArrayToObject = (errors: any) => {
	if (!errors) return;
	const result = {};
	// eslint-disable-next-line
	errors.forEach((item: any) => {
		// eslint-disable-next-line
		// @ts-expect-error
		result[item.field] = item.message;
	});
	return result;
};
