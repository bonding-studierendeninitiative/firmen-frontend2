import * as v from 'valibot';

export const SetOrgDetailsRequestSchema = v.object({
	organizationEmail: v.pipe(v.string(), v.email()),
	organizationPhone: v.string(),
	organizationWebsite: v.optional(v.string())
});

export const SetOrgAddressSchema = v.object({
	entityName: v.pipe(
		v.string('Der Organisationsname ist erforderlich'),
		v.transform((str) => str.trim()),
		v.minLength(2, 'Must be at least 2 characters')
	),
	street: v.pipe(
		v.string('Die Straßenadresse ist erforderlich'),
		v.transform((str) => str.trim()),
		v.minLength(2, 'Must be at least 2 characters')
	),
	extendedAddress: v.optional(v.pipe(v.string())),
	country: v.pipe(
		v.string('Das Land ist erforderlich'),
		v.transform((str) => str.trim()),
		v.minLength(2, 'Must be at least 2 characters')
	),
	zipCode: v.pipe(
		v.string('Die Postleitzahl ist erforderlich'),
		v.transform((str) => str.trim()),
		v.minLength(2, 'Must be at least 2 characters')
	),
	locality: v.pipe(
		v.string('Die Stadt ist erforderlich'),
		v.transform((str) => str.trim()),
		v.minLength(2, 'Must be at least 2 characters')
	)
});
