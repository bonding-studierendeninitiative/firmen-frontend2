import * as v from 'valibot';

export const CreateEventRegistrationSchema = v.object({
	eventId: v.pipe(v.string(), v.nonEmpty()),
	organizationId: v.pipe(v.string(), v.nonEmpty()),
	contactPersonId: v.pipe(v.string(), v.nonEmpty()),
	contractLegalEntityName: v.pipe(v.string(), v.nonEmpty('Legal name required')),
	contractAddressStreet: v.pipe(v.string(), v.nonEmpty('Street required')),
	contractAddressZipCode: v.pipe(v.string(), v.nonEmpty('Zip Code required')),
	contractAddressCity: v.pipe(v.string(), v.nonEmpty('City required')),
	contractAddressCountry: v.pipe(v.string(), v.nonEmpty('Country required')),
	billingOrganizationName: v.optional(v.string(), ''),
	billingStreet: v.optional(v.string(), ''),
	billingZipCode: v.optional(v.string(), ''),
	billingCity: v.optional(v.string(), ''),
	billingCountry: v.optional(v.string(), ''),
	billingVat: v.optional(v.string(), ''),
	billingReference: v.optional(v.string(), ''),
	packageId: v.optional(v.string(), ''),
	selectedAddonPackages: v.array(v.string()),
	selectedAddons: v.array(v.string()),
	participationNote: v.optional(v.string(), ''),
	language: v.optional(v.string(), 'ENGLISH')
});

export const CreateEventRegistrationResponse = v.object({
	eventRegistrationId: v.string(),
	createdAt: v.nullish(v.pipe(v.string(), v.isoTimestamp()))
});

export type CreateEventRegistration = typeof CreateEventRegistrationSchema;

const EventRegistrationAddonPackageSchema = v.object({
	purchasable: v.nullable(v.boolean(), false),
	title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
	price: v.nullable(v.number()),
	description: v.nullable(v.pipe(v.string(), v.maxLength(255)), ''),
	label: v.string(),
	selected: v.boolean(),
	addons: v.array(
		v.object({
			title: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
			label: v.string(),
			selected: v.boolean(),
			description: v.optional(v.pipe(v.string(), v.maxLength(255))),
			price: v.optional(v.number())
		})
	)
});

export const ConfirmEventRegistrationSchema = v.object({
	eventRegistrationId: v.string()
});

export const RejectEventRegistrationSchema = v.object({
	eventRegistrationId: v.string()
});

export type ConfirmEventRegistrationSchema = typeof ConfirmEventRegistrationSchema;
export type RejectEventRegistrationSchema = typeof RejectEventRegistrationSchema;

export const EventRegistrationSchema = v.object({
	id: v.string(),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	organizationComment: v.nullable(v.string()),
	participationNote: v.nullable(v.string()),
	contactPerson: v.object({
		fullName: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	organization: v.object({
		name: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	status: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	portraitStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	logoStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	advertisementStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	addonPackages: v.array(EventRegistrationAddonPackageSchema),
	purchasedPackage: v.object({
		price: v.number(),
		name: v.string()
	})
});

export const OrgEventRegistrationSchema = v.object({
	id: v.string(),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	organizationComment: v.nullable(v.string()),
	participationNote: v.nullable(v.string()),
	contactPerson: v.object({
		fullName: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	organization: v.object({
		name: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	status: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	event: v.object({
		id: v.string(),
		name: v.string(),
		projectHSG: v.string(),
		dateFrom: v.string(),
		dateTo: v.nullish(v.string()),
		location: v.string()
	}),
	portraitStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	logoStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	advertisementStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	addonPackages: v.array(EventRegistrationAddonPackageSchema),
	purchasedPackage: v.object({
		price: v.number(),
		name: v.string()
	})
});

export type EventRegistration = typeof EventRegistrationSchema;
export type OrgEventRegistration = typeof OrgEventRegistrationSchema;

export const GetEventRegistrationsForEventResponse = v.object({
	eventRegistrations: v.array(EventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export const GetEventRegistrationsForOrganizationResponse = v.object({
	eventRegistrations: v.array(OrgEventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetEventRegistrationsForOrganizationResponse =
	typeof GetEventRegistrationsForEventResponse;
