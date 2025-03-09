import * as v from 'valibot';
import { APIEvent } from '@schema/events';

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
	selectedEventDays: v.array(v.string()),
	selectedAmountOfParticipationDays: v.number(),
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

export const DeleteEventRegistrationSchema = v.object({
	eventRegistrationId: v.string()
});

export type ConfirmEventRegistrationSchema = typeof ConfirmEventRegistrationSchema;
export type RejectEventRegistrationSchema = typeof RejectEventRegistrationSchema;
export type DeleteEventRegistrationSchema = typeof DeleteEventRegistrationSchema;

export const EventRegistrationSchema = v.object({
	id: v.string(),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	organizationComment: v.nullable(v.string()),
	participationNote: v.nullable(v.string()),
	userId: v.string(),
	organizationId: v.string(),
	status: v.string(),
	portraitStatus: v.string(),
	logoStatus: v.string(),
	advertisementStatus: v.string(),
	addonPackages: v.array(EventRegistrationAddonPackageSchema),
	purchasedPackage: v.object({
		price: v.number(),
		name: v.string()
	}),
	advertisement: v.nullish(
		v.object({
			status: v.string(),
			name: v.string(),
			url: v.nullish(v.string())
		})
	),
	logo: v.nullish(
		v.object({
			status: v.string(),
			mimeType: v.string(),
			name: v.string(),
			url: v.nullish(v.string())
		})
	)
});

export const OrgEventRegistrationSchema = v.object({
	id: v.string(),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	organizationComment: v.nullable(v.string()),
	participationNote: v.nullable(v.string()),
	organizationId: v.string(),
	status: v.string(),
	event: APIEvent,
	portraitStatus: v.string(),
	logoStatus: v.string(),
	advertisementStatus: v.string(),
	addonPackages: v.array(EventRegistrationAddonPackageSchema),
	purchasedPackage: v.nullish(
		v.object({
			price: v.number(),
			name: v.string()
		})
	),
	advertisement: v.nullish(
		v.object({
			status: v.string(),
			name: v.string(),
			url: v.nullish(v.string())
		})
	),
	logo: v.nullish(
		v.object({
			status: v.string(),
			mimeType: v.string(),
			name: v.string(),
			url: v.nullish(v.string())
		})
	),
	desiredEventRegistrationDays: v.nullish(v.array(v.string())),
	contactPeople: v.nullish(v.array(v.string())),
	canUploadAdvertisement: v.nullish(v.boolean())
});

export type EventRegistration = typeof EventRegistrationSchema;
export type OrgEventRegistration = typeof OrgEventRegistrationSchema;

export const AdminEventRegistrationsResponse = v.object({
	eventRegistrations: v.array(
		v.object({
			id: v.string(),
			createdAt: v.pipe(v.string(), v.isoTimestamp()),
			modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
			organizationComment: v.nullable(v.string()),
			participationNote: v.nullable(v.string()),
			organizationId: v.string(),
			status: v.string(),
			portraitStatus: v.string(),
			logoStatus: v.string(),
			advertisementStatus: v.string(),
			addonPackages: v.array(EventRegistrationAddonPackageSchema),
			purchasedPackage: v.nullable(
				v.object({
					price: v.nullable(v.number()),
					name: v.nullable(v.string())
				})
			),
			advertisement: v.nullish(
				v.object({
					status: v.string(),
					name: v.string(),
					url: v.nullish(v.string())
				})
			),
			logo: v.nullish(
				v.object({
					status: v.string(),
					mimeType: v.string(),
					name: v.string(),
					url: v.nullish(v.string())
				})
			),
			desiredEventRegistrationDays: v.nullish(v.array(v.string())),
			contactPeople: v.nullish(v.array(v.string()))
		})
	),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type AdminEventRegistrationsResponse = typeof AdminEventRegistrationsResponse;

export const GetEventRegistrationsForOrganizationResponse = v.object({
	eventRegistrations: v.array(OrgEventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetEventRegistrationsForOrganizationResponse =
	typeof GetEventRegistrationsForOrganizationResponse;

export const AdminRegisterOrganizationToEventSchema = v.object({
	eventId: v.pipe(v.string(), v.nonEmpty()),
	organizationId: v.pipe(v.string(), v.nonEmpty()),
	contactPeople: v.array(v.pipe(v.string(), v.nonEmpty())),
	canUploadAdvertisement: v.boolean()
});

export type AdminRegisterOrganizationToEvent = typeof AdminRegisterOrganizationToEventSchema;
