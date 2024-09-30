import { API } from '@api';
import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';

export const CreateEventRegistrationSchema = v.object({
	eventId: v.pipe(v.string(), v.nonEmpty()),
	organizationId: v.pipe(v.string(), v.nonEmpty()),
	contactPersonId: v.pipe(v.string(), v.nonEmpty()),
	contractLegalEntityName: v.pipe(v.string(), v.nonEmpty("Legal name required")),
	contractAddressStreet: v.pipe(v.string(), v.nonEmpty("Street required")),
	contractAddressZipCode: v.pipe(v.string(), v.nonEmpty("Zip Code required")),
	contractAddressCity: v.pipe(v.string(), v.nonEmpty("City required")),
	contractAddressCountry: v.pipe(v.string(), v.nonEmpty("Country required")),
	billingOrganizationName: v.optional(v.string(), ""),
	billingStreet: v.optional(v.string(), ""),
	billingZipCode: v.optional(v.string(), ""),
	billingCity: v.optional(v.string(), ""),
	billingCountry: v.optional(v.string(), ""),
	billingVat: v.optional(v.string(), ""),
	billingReference: v.optional(v.string(), ""),
	packageId: v.optional(v.string(), ""),
	selectedAddonPackages: v.array(v.string()),
	selectedAddons: v.array(v.string()),
	participationNote: v.optional(v.string(), ""),
	language: v.optional(v.string(), "ENGLISH"),
})

export type CreateEventRegistration = Infer<typeof CreateEventRegistrationSchema>;

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
	addonPackages: v.array(EventRegistrationAddonPackageSchema)
});

export type EventRegistration = typeof EventRegistrationSchema;

const GetEventRegistrationsResponse = v.object({
	eventRegistrations: v.array(EventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export const getEventRegistrations = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
	status?: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
}) => {
	const response = await API.get<v.InferInput<typeof GetEventRegistrationsResponse>>({
		route: `/event/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventRegistrationsResponse, data);
};
