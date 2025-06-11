import * as v from "valibot";

export type DetailedPortraitTemplateResponse = v.InferOutput<typeof DetailedPortraitTemplateResponse>;
export const DetailedPortraitTemplateResponse = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  comment: v.optional(v.string()),
  industry: v.optional(v.string()),
  products: v.optional(v.string()),
  locations_worldwide: v.optional(v.string()),
  locations_europe: v.optional(v.string()),
  locations_germany: v.optional(v.string()),
  revenue_worldwide: v.optional(v.string()),
  revenue_europe: v.optional(v.string()),
  revenue_germany: v.optional(v.string()),
  employees_worldwide: v.optional(v.string()),
  employees_europe: v.optional(v.string()),
  employees_germany: v.optional(v.string()),
  graduates: v.optional(v.string()),
  desiredDisciplines: v.optional(v.string()),
  entryOptions: v.optional(v.string()),
  offersThesis: v.optional(v.boolean()),
  offersOutOfCountryWork: v.optional(v.boolean()),
  offersInternships: v.optional(v.boolean()),
  contactAddress: v.optional(v.string()),
  contactPersonStudents: v.optional(v.string()),
  contactPersonGraduates: v.optional(v.string()),
  website: v.optional(v.string()),
  additionalInformation: v.optional(v.string()),
  displayName: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  createdAt: v.optional(v.string()),
});

export type PortraitTemplateInput = v.InferOutput<typeof PortraitTemplateInput>;
export const PortraitTemplateInput = v.object({
  title: v.string(),
  comment: v.string(),
  industry: v.string(),
  products: v.string(),
  locations_worldwide: v.string(),
  locations_europe: v.string(),
  locations_germany: v.string(),
  revenue_worldwide: v.string(),
  revenue_europe: v.string(),
  revenue_germany: v.string(),
  employees_worldwide: v.string(),
  employees_europe: v.string(),
  employees_germany: v.string(),
  graduates: v.string(),
  desiredDisciplines: v.string(),
  entryOptions: v.string(),
  offersThesis: v.boolean(),
  offersOutOfCountryWork: v.boolean(),
  offersInternships: v.boolean(),
  contactAddress: v.string(),
  contactPersonStudents: v.string(),
  contactPersonGraduates: v.string(),
  website: v.string(),
  additionalInformation: v.string(),
  displayName: v.string(),
});

export type StatusType = v.InferOutput<typeof StatusType>;
export const StatusType = v.object({
  statusCode: v.optional(v.number()),
  reasonPhrase: v.optional(v.string()),
});

export type Problem = v.InferOutput<typeof Problem>;
export const Problem = v.object({
  parameters: v.optional(v.record(v.string(), v.unknown())),
  instance: v.optional(v.string()),
  type: v.optional(v.string()),
  title: v.optional(v.string()),
  status: v.optional(StatusType),
  detail: v.optional(v.string()),
});

export type BillingAddressTemplateResponse = v.InferOutput<typeof BillingAddressTemplateResponse>;
export const BillingAddressTemplateResponse = v.object({
  id: v.optional(v.string()),
  organizationID: v.optional(v.string()),
  street: v.optional(v.string()),
  country: v.optional(v.string()),
  zipCode: v.optional(v.string()),
  city: v.optional(v.string()),
  vat: v.optional(v.string()),
  billingReference: v.optional(v.string()),
  organizationName: v.optional(v.string()),
});

export type EditBillingAddressTemplateInput = v.InferOutput<typeof EditBillingAddressTemplateInput>;
export const EditBillingAddressTemplateInput = v.object({
  street: v.optional(v.string()),
  country: v.optional(v.string()),
  zipCode: v.optional(v.string()),
  city: v.optional(v.string()),
  vat: v.optional(v.string()),
  billingReference: v.optional(v.string()),
  organizationName: v.optional(v.string()),
});

export type CreateDocumentRequest = v.InferOutput<typeof CreateDocumentRequest>;
export const CreateDocumentRequest = v.object({
  organizationId: v.optional(v.string()),
  originalFilename: v.optional(v.string()),
  mimeType: v.optional(v.string()),
  type: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  title: v.optional(v.string()),
});

export type UploadUrlResponse = v.InferOutput<typeof UploadUrlResponse>;
export const UploadUrlResponse = v.object({
  url: v.optional(v.string()),
});

export type AddBillingAddressTemplateInput = v.InferOutput<typeof AddBillingAddressTemplateInput>;
export const AddBillingAddressTemplateInput = v.object({
  street: v.string(),
  country: v.string(),
  zipCode: v.string(),
  city: v.string(),
  vat: v.string(),
  billingReference: v.string(),
  organizationName: v.string(),
});

export type RegisterOrganizationToEventOutput = v.InferOutput<typeof RegisterOrganizationToEventOutput>;
export const RegisterOrganizationToEventOutput = v.object({
  eventRegistrationId: v.optional(v.string()),
  createdAt: v.optional(v.string()),
});

export type RegisterOrganizationToEventInput = v.InferOutput<typeof RegisterOrganizationToEventInput>;
export const RegisterOrganizationToEventInput = v.object({
  eventId: v.string(),
  organizationId: v.string(),
  contactPersonId: v.string(),
  contractLegalEntityName: v.string(),
  contractAddressStreet: v.string(),
  contractAddressZipCode: v.string(),
  contractAddressCity: v.string(),
  contractAddressCountry: v.string(),
  billingOrganizationName: v.string(),
  billingStreet: v.string(),
  billingZipCode: v.string(),
  billingCity: v.string(),
  billingCountry: v.string(),
  billingVat: v.string(),
  billingReference: v.string(),
  packageId: v.string(),
  selectedAddonPackages: v.array(v.string()),
  selectedAddons: v.array(v.string()),
  selectedEventDays: v.array(v.string()),
  selectedAmountOfParticipationDays: v.number(),
  participationNote: v.string(),
  language: v.union([v.literal("ENGLISH"), v.literal("GERMAN"), v.literal("ROMANIAN")]),
});

export type SubmitPortraitInput = v.InferOutput<typeof SubmitPortraitInput>;
export const SubmitPortraitInput = v.object({
  title: v.string(),
  comment: v.string(),
  industry: v.string(),
  products: v.string(),
  locationsWorldwide: v.string(),
  locationsEurope: v.string(),
  locationsGermany: v.string(),
  revenueWorldwide: v.string(),
  revenueEurope: v.string(),
  revenueGermany: v.string(),
  employeesWorldwide: v.string(),
  employeesEurope: v.string(),
  employeesGermany: v.string(),
  graduates: v.string(),
  desiredDisciplines: v.string(),
  entryOptions: v.string(),
  offersThesis: v.boolean(),
  offersOutOfCountryWork: v.boolean(),
  offersInternships: v.boolean(),
  contactAddress: v.string(),
  contactPersonStudents: v.string(),
  contactPersonGraduates: v.string(),
  website: v.string(),
  additionalInformation: v.string(),
  displayName: v.string(),
  organization: v.string(),
});

export type ChangeContactPeopleInput = v.InferOutput<typeof ChangeContactPeopleInput>;
export const ChangeContactPeopleInput = v.object({
  contactPeople: v.optional(v.array(v.string())),
});

export type GetPortraitTemplatesByOrganizationOutput = v.InferOutput<typeof GetPortraitTemplatesByOrganizationOutput>;
export const GetPortraitTemplatesByOrganizationOutput = v.object({
  portraitTemplates: v.optional(v.array(DetailedPortraitTemplateResponse)),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
});

export type DocumentFeedbackOutput = v.InferOutput<typeof DocumentFeedbackOutput>;
export const DocumentFeedbackOutput = v.object({
  feedbackType: v.optional(v.string()),
  message: v.optional(v.string()),
  timestamp: v.optional(v.string()),
});

export type SimpleDocumentVersionOutput = v.InferOutput<typeof SimpleDocumentVersionOutput>;
export const SimpleDocumentVersionOutput = v.object({
  versionId: v.optional(v.string()),
  size: v.optional(v.number()),
  contentType: v.optional(v.string()),
  isLatest: v.optional(v.boolean()),
  uploadStatus: v.optional(
    v.union([
      v.literal("PENDING_METADATA"),
      v.literal("PENDING_UPLOAD"),
      v.literal("UPLOADED"),
      v.literal("PROCESSING_DERIVATIVES"),
      v.literal("COMPLETED"),
      v.literal("ERROR_UPLOAD"),
      v.literal("ERROR_PROCESSING"),
      v.literal("ARCHIVED"),
      v.literal("DELETED"),
    ]),
  ),
  reviewStatus: v.optional(
    v.union([v.literal("unreviewed"), v.literal("changes-requested"), v.literal("rejected"), v.literal("confirmed")]),
  ),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  history: v.optional(v.array(DocumentFeedbackOutput)),
});

export type DetailedDocumentOutput = v.InferOutput<typeof DetailedDocumentOutput>;
export const DetailedDocumentOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  documentType: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  activeVersion: v.optional(SimpleDocumentVersionOutput),
  organizationId: v.optional(v.string()),
});

export type UnknownContentTypeDocumentVersionOutput = v.InferOutput<typeof UnknownContentTypeDocumentVersionOutput>;
export const UnknownContentTypeDocumentVersionOutput = v.object({
  versionId: v.optional(v.string()),
  lastModified: v.optional(v.string()),
  size: v.optional(v.number()),
  isLatest: v.optional(v.boolean()),
});

export type SimpleDocumentOutput = v.InferOutput<typeof SimpleDocumentOutput>;
export const SimpleDocumentOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  documentType: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  activeVersion: v.optional(SimpleDocumentVersionOutput),
  organizationId: v.optional(v.string()),
});

export type DetailedDocumentVersionOutput = v.InferOutput<typeof DetailedDocumentVersionOutput>;
export const DetailedDocumentVersionOutput = v.object({
  versionId: v.optional(v.string()),
  size: v.optional(v.number()),
  contentType: v.optional(v.string()),
  isLatest: v.optional(v.boolean()),
  uploadStatus: v.optional(
    v.union([
      v.literal("PENDING_METADATA"),
      v.literal("PENDING_UPLOAD"),
      v.literal("UPLOADED"),
      v.literal("PROCESSING_DERIVATIVES"),
      v.literal("COMPLETED"),
      v.literal("ERROR_UPLOAD"),
      v.literal("ERROR_PROCESSING"),
      v.literal("ARCHIVED"),
      v.literal("DELETED"),
    ]),
  ),
  reviewStatus: v.optional(
    v.union([v.literal("unreviewed"), v.literal("changes-requested"), v.literal("rejected"), v.literal("confirmed")]),
  ),
  document: v.optional(SimpleDocumentOutput),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  history: v.optional(v.array(DocumentFeedbackOutput)),
});

export type DocumentVersionDescription = v.InferOutput<typeof DocumentVersionDescription>;
export const DocumentVersionDescription = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  documentType: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  version: v.optional(SimpleDocumentVersionOutput),
  organizationId: v.optional(v.string()),
});

export type GetAllDocumentsForOrganizationOutput = v.InferOutput<typeof GetAllDocumentsForOrganizationOutput>;
export const GetAllDocumentsForOrganizationOutput = v.object({
  documents: v.optional(v.array(SimpleDocumentOutput)),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
});

export type GetBillingAddressTemplatesOutput = v.InferOutput<typeof GetBillingAddressTemplatesOutput>;
export const GetBillingAddressTemplatesOutput = v.object({
  billingAddressTemplates: v.optional(v.array(BillingAddressTemplateResponse)),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
});

export type LocalTime = v.InferOutput<typeof LocalTime>;
export const LocalTime = v.object({
  hour: v.optional(v.number()),
  minute: v.optional(v.number()),
  second: v.optional(v.number()),
  nano: v.optional(v.number()),
});

export type DetailedEventResponse = v.InferOutput<typeof DetailedEventResponse>;
export const DetailedEventResponse = v.object({
  id: v.optional(v.string()),
  notesId: v.optional(v.string()),
  name: v.optional(v.string()),
  status: v.optional(v.union([v.literal("UNPUBLISHED"), v.literal("PUBLISHED"), v.literal("ARCHIVED")])),
  projectHSG: v.optional(v.string()),
  location: v.optional(v.string()),
  dateFrom: v.optional(v.string()),
  timeFrom: v.optional(LocalTime),
  dateTo: v.optional(v.string()),
  timeTo: v.optional(LocalTime),
  comment: v.optional(v.string()),
  latestRegistration: v.optional(v.string()),
  notesCategory: v.optional(v.string()),
  descriptionNotes: v.optional(v.string()),
  contactMail: v.optional(v.string()),
  website: v.optional(v.string()),
  additionalLink: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
});

export type AdvertisementOutput = v.InferOutput<typeof AdvertisementOutput>;
export const AdvertisementOutput = v.object({
  documentId: v.optional(v.string()),
  versionId: v.optional(v.string()),
  status: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
});

export type EventRegistrationAddonOutput = v.InferOutput<typeof EventRegistrationAddonOutput>;
export const EventRegistrationAddonOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  price: v.optional(v.number()),
  selected: v.optional(v.boolean()),
  label: v.optional(v.string()),
});

export type EventRegistrationAddonPackageOutput = v.InferOutput<typeof EventRegistrationAddonPackageOutput>;
export const EventRegistrationAddonPackageOutput = v.object({
  id: v.optional(v.string()),
  purchasable: v.optional(v.boolean()),
  selected: v.optional(v.boolean()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
  eventId: v.optional(v.string()),
  addons: v.optional(v.array(EventRegistrationAddonOutput)),
});

export type PurchasedPackageOutput = v.InferOutput<typeof PurchasedPackageOutput>;
export const PurchasedPackageOutput = v.object({
  price: v.optional(v.number()),
  name: v.optional(v.string()),
});

export type SimpleEventResponse = v.InferOutput<typeof SimpleEventResponse>;
export const SimpleEventResponse = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  location: v.optional(v.string()),
  projectHSG: v.optional(v.string()),
  dateFrom: v.optional(v.string()),
  dateTo: v.optional(v.string()),
});

export type LogoOutput = v.InferOutput<typeof LogoOutput>;
export const LogoOutput = v.object({
  documentId: v.optional(v.string()),
  versionId: v.optional(v.string()),
  status: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
});

export type GetEventRegistrationForOrganizationOutput = v.InferOutput<typeof GetEventRegistrationForOrganizationOutput>;
export const GetEventRegistrationForOrganizationOutput = v.object({
  id: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  status: v.optional(
    v.union([v.literal("created"), v.literal("rejected"), v.literal("confirmed"), v.literal("withdrawn")]),
  ),
  advertisementStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  portraitStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  logoStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  organizationComment: v.optional(v.string()),
  participationNote: v.optional(v.string()),
  purchasedPackage: v.optional(PurchasedPackageOutput),
  userId: v.optional(v.string()),
  event: v.optional(SimpleEventResponse),
  addonPackages: v.optional(v.array(EventRegistrationAddonPackageOutput)),
  advertisement: v.optional(AdvertisementOutput),
  logo: v.optional(LogoOutput),
  organizationId: v.optional(v.string()),
  desiredEventRegistrationDayDates: v.optional(v.array(v.string())),
  contactPeople: v.optional(v.array(v.string())),
  canUploadAdvertisement: v.optional(v.boolean()),
});

export type AddonOutput = v.InferOutput<typeof AddonOutput>;
export const AddonOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
});

export type AddonPackageOutput = v.InferOutput<typeof AddonPackageOutput>;
export const AddonPackageOutput = v.object({
  id: v.optional(v.string()),
  purchasable: v.optional(v.boolean()),
  description: v.optional(v.string()),
  title: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
  addons: v.optional(v.array(AddonOutput)),
});

export type EventDayOutput = v.InferOutput<typeof EventDayOutput>;
export const EventDayOutput = v.object({
  dayDate: v.optional(v.string()),
  totalCapacity: v.optional(v.number()),
  remainingCapacity: v.optional(v.number()),
});

export type PackageBenefitOutput = v.InferOutput<typeof PackageBenefitOutput>;
export const PackageBenefitOutput = v.object({
  stringValue: v.optional(v.string()),
  numericValue: v.optional(v.number()),
  booleanValue: v.optional(v.boolean()),
});

export type PackageV3Output = v.InferOutput<typeof PackageV3Output>;
export const PackageV3Output = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  price: v.optional(v.number()),
  benefits: v.optional(v.array(PackageBenefitOutput)),
});

export type ServiceOutput = v.InferOutput<typeof ServiceOutput>;
export const ServiceOutput = v.object({
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  valueType: v.optional(v.string()),
});

export type GetActiveEventBuyOptionOutput = v.InferOutput<typeof GetActiveEventBuyOptionOutput>;
export const GetActiveEventBuyOptionOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  packages: v.optional(v.array(PackageV3Output)),
  services: v.optional(v.array(ServiceOutput)),
  eventDays: v.optional(v.array(EventDayOutput)),
  addonPackages: v.optional(v.array(AddonPackageOutput)),
  active: v.optional(v.boolean()),
  allowedSignUpDays: v.optional(v.number()),
});

export type AllEventsOutput = v.InferOutput<typeof AllEventsOutput>;
export const AllEventsOutput = v.object({
  data: v.optional(v.array(SimpleEventResponse)),
  page: v.optional(v.number()),
  size: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
  status: v.optional(v.array(v.union([v.literal("UNPUBLISHED"), v.literal("PUBLISHED"), v.literal("ARCHIVED")]))),
});

export type GetEventRegistrationsForOrganizationOutput = v.InferOutput<
  typeof GetEventRegistrationsForOrganizationOutput
>;
export const GetEventRegistrationsForOrganizationOutput = v.object({
  eventRegistrations: v.optional(v.array(GetEventRegistrationForOrganizationOutput)),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
});

export type GetEventRegistrationForEventOutput = v.InferOutput<typeof GetEventRegistrationForEventOutput>;
export const GetEventRegistrationForEventOutput = v.object({
  id: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  status: v.optional(
    v.union([v.literal("created"), v.literal("rejected"), v.literal("confirmed"), v.literal("withdrawn")]),
  ),
  organizationComment: v.optional(v.string()),
  participationNote: v.optional(v.string()),
  purchasedPackage: v.optional(PurchasedPackageOutput),
  addonPackages: v.optional(v.array(EventRegistrationAddonPackageOutput)),
  advertisement: v.optional(AdvertisementOutput),
  logo: v.optional(LogoOutput),
  desiredEventRegistrationDays: v.optional(v.array(v.string())),
  organizationId: v.optional(v.string()),
  contactPeople: v.optional(v.array(v.string())),
});

export type GetEventRegistrationForUserOutput = v.InferOutput<typeof GetEventRegistrationForUserOutput>;
export const GetEventRegistrationForUserOutput = v.object({
  id: v.optional(v.string()),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  status: v.optional(
    v.union([v.literal("created"), v.literal("rejected"), v.literal("confirmed"), v.literal("withdrawn")]),
  ),
  advertisementStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  portraitStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  logoStatus: v.optional(
    v.union([
      v.literal("missing"),
      v.literal("uploaded"),
      v.literal("generating-thumbnails"),
      v.literal("thumbnails-ready"),
      v.literal("changes-requested"),
      v.literal("rejected"),
      v.literal("confirmed"),
    ]),
  ),
  organizationComment: v.optional(v.string()),
  participationNote: v.optional(v.string()),
  purchasedPackage: v.optional(PurchasedPackageOutput),
  event: v.optional(SimpleEventResponse),
  addonPackages: v.optional(v.array(EventRegistrationAddonPackageOutput)),
  userId: v.optional(v.string()),
  organizationId: v.optional(v.string()),
});

export type GetEventRegistrationsForContactPersonOutput = v.InferOutput<
  typeof GetEventRegistrationsForContactPersonOutput
>;
export const GetEventRegistrationsForContactPersonOutput = v.object({
  eventRegistrations: v.optional(v.array(GetEventRegistrationForUserOutput)),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
});

export type __ENDPOINTS_START__ = v.InferOutput<typeof __ENDPOINTS_START__>;
export const __ENDPOINTS_START__ = v.object({});

export type get_Load = v.InferOutput<typeof get_Load>;
export const get_Load = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/portrait-template/{portraitTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      portraitTemplateId: v.string(),
    }),
  }),
  response: DetailedPortraitTemplateResponse,
});

export type put_SaveOrUpdatePortrait = v.InferOutput<typeof put_SaveOrUpdatePortrait>;
export const put_SaveOrUpdatePortrait = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/portrait-template/{portraitTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      portraitTemplateId: v.string(),
    }),
    body: PortraitTemplateInput,
  }),
  response: DetailedPortraitTemplateResponse,
});

export type delete_DeletePortraitTemplate = v.InferOutput<typeof delete_DeletePortraitTemplate>;
export const delete_DeletePortraitTemplate = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/portrait-template/{portraitTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      portraitTemplateId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetBillingAddressTemplate = v.InferOutput<typeof get_GetBillingAddressTemplate>;
export const get_GetBillingAddressTemplate = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      billingAddressTemplateId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: BillingAddressTemplateResponse,
});

export type put_EditBillingAddressTemplate = v.InferOutput<typeof put_EditBillingAddressTemplate>;
export const put_EditBillingAddressTemplate = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      billingAddressTemplateId: v.string(),
      organizationId: v.string(),
    }),
    body: EditBillingAddressTemplateInput,
  }),
  response: BillingAddressTemplateResponse,
});

export type delete_DeleteBillingAddressTemplate = v.InferOutput<typeof delete_DeleteBillingAddressTemplate>;
export const delete_DeleteBillingAddressTemplate = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      billingAddressTemplateId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetPortraitTemplatesForOrganization = v.InferOutput<typeof get_GetPortraitTemplatesForOrganization>;
export const get_GetPortraitTemplatesForOrganization = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/portrait-template"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      organizationId: v.string(),
      page: v.optional(v.union([v.number(), v.undefined()])),
      limit: v.optional(v.union([v.number(), v.undefined()])),
      sortBy: v.optional(v.union([v.string(), v.undefined()])),
      sortDirection: v.optional(v.union([v.string(), v.undefined()])),
    }),
  }),
  response: GetPortraitTemplatesByOrganizationOutput,
});

export type post_SaveOrUpdatePortrait_1 = v.InferOutput<typeof post_SaveOrUpdatePortrait_1>;
export const post_SaveOrUpdatePortrait_1 = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/portrait-template"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      organizationId: v.string(),
    }),
    body: PortraitTemplateInput,
  }),
  response: DetailedPortraitTemplateResponse,
});

export type post_RestoreVersion = v.InferOutput<typeof post_RestoreVersion>;
export const post_RestoreVersion = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/restore"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
      versionId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_RequestUploadUrl = v.InferOutput<typeof post_RequestUploadUrl>;
export const post_RequestUploadUrl = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/request-upload-url"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      organizationId: v.string(),
    }),
    body: CreateDocumentRequest,
  }),
  response: UploadUrlResponse,
});

export type get_GetBillingAddressTemplatesByOrganization = v.InferOutput<
  typeof get_GetBillingAddressTemplatesByOrganization
>;
export const get_GetBillingAddressTemplatesByOrganization = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/billing-address-template"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.union([v.number(), v.undefined()])),
      size: v.optional(v.union([v.number(), v.undefined()])),
      sortDirection: v.string(),
      sortBy: v.string(),
    }),
    path: v.object({
      organizationId: v.string(),
    }),
  }),
  response: GetBillingAddressTemplatesOutput,
});

export type post_AddBillingAddressTemplate = v.InferOutput<typeof post_AddBillingAddressTemplate>;
export const post_AddBillingAddressTemplate = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/organization/{organizationId}/billing-address-template"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      organizationId: v.string(),
    }),
    body: AddBillingAddressTemplateInput,
  }),
  response: BillingAddressTemplateResponse,
});

export type get_GetEventRegistrationsForOrganization = v.InferOutput<typeof get_GetEventRegistrationsForOrganization>;
export const get_GetEventRegistrationsForOrganization = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event-registration"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      organizationId: v.string(),
      page: v.optional(v.union([v.number(), v.undefined()])),
      limit: v.optional(v.union([v.number(), v.undefined()])),
      sortBy: v.optional(v.union([v.string(), v.undefined()])),
      sortDirection: v.optional(v.union([v.string(), v.undefined()])),
    }),
  }),
  response: GetEventRegistrationsForOrganizationOutput,
});

export type post_RegisterOrganizationToEvent = v.InferOutput<typeof post_RegisterOrganizationToEvent>;
export const post_RegisterOrganizationToEvent = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: RegisterOrganizationToEventInput,
  }),
  response: RegisterOrganizationToEventOutput,
});

export type post_Withdraw = v.InferOutput<typeof post_Withdraw>;
export const post_Withdraw = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}/withdraw"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_SubmitPortrait = v.InferOutput<typeof post_SubmitPortrait>;
export const post_SubmitPortrait = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}/portrait/submit"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
    body: SubmitPortraitInput,
  }),
  response: v.unknown(),
});

export type post_PickLogoForEventRegistration = v.InferOutput<typeof post_PickLogoForEventRegistration>;
export const post_PickLogoForEventRegistration = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}/pick-logo/{documentId}/{versionId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
      documentId: v.string(),
      versionId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_PickAdvertisementForEventRegistration = v.InferOutput<
  typeof post_PickAdvertisementForEventRegistration
>;
export const post_PickAdvertisementForEventRegistration = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}/pick-advertisement/{advertisementId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
      advertisementId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_ChangeContactPeople = v.InferOutput<typeof post_ChangeContactPeople>;
export const post_ChangeContactPeople = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}/change-contact-people"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
    body: ChangeContactPeopleInput,
  }),
  response: v.unknown(),
});

export type get_GetDocument = v.InferOutput<typeof get_GetDocument>;
export const get_GetDocument = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: DetailedDocumentOutput,
});

export type delete_DeleteDocument = v.InferOutput<typeof delete_DeleteDocument>;
export const delete_DeleteDocument = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      "ignore-conflict": v.optional(v.boolean()),
    }),
    path: v.object({
      organizationId: v.string(),
      documentId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetDocumentVersions = v.InferOutput<typeof get_GetDocumentVersions>;
export const get_GetDocumentVersions = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: v.array(UnknownContentTypeDocumentVersionOutput),
});

export type get_GetDocumentVersion = v.InferOutput<typeof get_GetDocumentVersion>;
export const get_GetDocumentVersion = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      versionId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: DetailedDocumentVersionOutput,
});

export type get_GetVersionDownloadUrl = v.InferOutput<typeof get_GetVersionDownloadUrl>;
export const get_GetVersionDownloadUrl = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/download"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
      versionId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetDocumentVersionDescription = v.InferOutput<typeof get_GetDocumentVersionDescription>;
export const get_GetDocumentVersionDescription = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/description"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      versionId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: DocumentVersionDescription,
});

export type get_GetThumbnailUrl = v.InferOutput<typeof get_GetThumbnailUrl>;
export const get_GetThumbnailUrl = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/thumbnail"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      resolution: v.optional(v.string()),
    }),
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetDownloadUrl = v.InferOutput<typeof get_GetDownloadUrl>;
export const get_GetDownloadUrl = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/{documentId}/download"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      documentId: v.string(),
      organizationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetAllDocumentsForOrganization = v.InferOutput<typeof get_GetAllDocumentsForOrganization>;
export const get_GetAllDocumentsForOrganization = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/organization/{organizationId}/catalogue-data/by-document-type/{documentType}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
      sortBy: v.optional(v.string()),
      sortDirection: v.optional(v.string()),
    }),
    path: v.object({
      organizationId: v.string(),
      documentType: v.string(),
    }),
  }),
  response: GetAllDocumentsForOrganizationOutput,
});

export type get_LoadEventById = v.InferOutput<typeof get_LoadEventById>;
export const get_LoadEventById = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event/{eventId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: DetailedEventResponse,
});

export type get_LoadUnregisteredEvents = v.InferOutput<typeof get_LoadUnregisteredEvents>;
export const get_LoadUnregisteredEvents = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event/{eventId}/is-registered"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      organizationId: v.string(),
    }),
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_ActiveEventBuyOption = v.InferOutput<typeof get_ActiveEventBuyOption>;
export const get_ActiveEventBuyOption = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event/{eventId}/active-buy-option"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: GetActiveEventBuyOptionOutput,
});

export type get_LoadUnregisteredEvents_1 = v.InferOutput<typeof get_LoadUnregisteredEvents_1>;
export const get_LoadUnregisteredEvents_1 = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event/unregistered"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      organizationId: v.string(),
      sortDirection: v.optional(v.union([v.string(), v.undefined()])),
      sortBy: v.optional(v.union([v.string(), v.undefined()])),
      page: v.optional(v.union([v.number(), v.undefined()])),
      size: v.optional(v.union([v.number(), v.undefined()])),
    }),
  }),
  response: AllEventsOutput,
});

export type get_LoadAll = v.InferOutput<typeof get_LoadAll>;
export const get_LoadAll = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event/published"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      sortDirection: v.optional(v.string()),
      sortBy: v.optional(v.string()),
      page: v.optional(v.number()),
      size: v.optional(v.number()),
    }),
  }),
  response: AllEventsOutput,
});

export type get_GetEventRegistration = v.InferOutput<typeof get_GetEventRegistration>;
export const get_GetEventRegistration = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event-registration/{eventRegistrationId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
  }),
  response: GetEventRegistrationForEventOutput,
});

export type get_GetEventRegistrationsForContactPerson = v.InferOutput<typeof get_GetEventRegistrationsForContactPerson>;
export const get_GetEventRegistrationsForContactPerson = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/event-registration/my"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
      sortBy: v.optional(v.string()),
      sortDirection: v.optional(v.string()),
    }),
  }),
  response: GetEventRegistrationsForContactPersonOutput,
});

export type __ENDPOINTS_END__ = v.InferOutput<typeof __ENDPOINTS_END__>;
export const __ENDPOINTS_END__ = v.object({});

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/api/v2/portrait-template/{portraitTemplateId}": get_Load,
    "/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}":
      get_GetBillingAddressTemplate,
    "/api/v2/portrait-template": get_GetPortraitTemplatesForOrganization,
    "/api/v2/organization/{organizationId}/billing-address-template": get_GetBillingAddressTemplatesByOrganization,
    "/api/v2/event-registration": get_GetEventRegistrationsForOrganization,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}": get_GetDocument,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions": get_GetDocumentVersions,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}": get_GetDocumentVersion,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/download":
      get_GetVersionDownloadUrl,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/description":
      get_GetDocumentVersionDescription,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/thumbnail": get_GetThumbnailUrl,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/download": get_GetDownloadUrl,
    "/api/v2/organization/{organizationId}/catalogue-data/by-document-type/{documentType}":
      get_GetAllDocumentsForOrganization,
    "/api/v2/event/{eventId}": get_LoadEventById,
    "/api/v2/event/{eventId}/is-registered": get_LoadUnregisteredEvents,
    "/api/v2/event/{eventId}/active-buy-option": get_ActiveEventBuyOption,
    "/api/v2/event/unregistered": get_LoadUnregisteredEvents_1,
    "/api/v2/event/published": get_LoadAll,
    "/api/v2/event-registration/{eventRegistrationId}": get_GetEventRegistration,
    "/api/v2/event-registration/my": get_GetEventRegistrationsForContactPerson,
  },
  put: {
    "/api/v2/portrait-template/{portraitTemplateId}": put_SaveOrUpdatePortrait,
    "/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}":
      put_EditBillingAddressTemplate,
  },
  delete: {
    "/api/v2/portrait-template/{portraitTemplateId}": delete_DeletePortraitTemplate,
    "/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}":
      delete_DeleteBillingAddressTemplate,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}": delete_DeleteDocument,
  },
  post: {
    "/api/v2/portrait-template": post_SaveOrUpdatePortrait_1,
    "/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/restore":
      post_RestoreVersion,
    "/api/v2/organization/{organizationId}/catalogue-data/request-upload-url": post_RequestUploadUrl,
    "/api/v2/organization/{organizationId}/billing-address-template": post_AddBillingAddressTemplate,
    "/api/v2/event-registration": post_RegisterOrganizationToEvent,
    "/api/v2/event-registration/{eventRegistrationId}/withdraw": post_Withdraw,
    "/api/v2/event-registration/{eventRegistrationId}/portrait/submit": post_SubmitPortrait,
    "/api/v2/event-registration/{eventRegistrationId}/pick-logo/{documentId}/{versionId}":
      post_PickLogoForEventRegistration,
    "/api/v2/event-registration/{eventRegistrationId}/pick-advertisement/{advertisementId}":
      post_PickAdvertisementForEventRegistration,
    "/api/v2/event-registration/{eventRegistrationId}/change-contact-people": post_ChangeContactPeople,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PutEndpoints = EndpointByMethod["put"];
export type DeleteEndpoints = EndpointByMethod["delete"];
export type PostEndpoints = EndpointByMethod["post"];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | "options" | MutationMethod;

type RequestFormat = "json" | "form-data" | "form-url" | "binary" | "text";

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  requestFormat: RequestFormat;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
};

export type Fetcher = (method: Method, url: string, parameters?: EndpointParameters | undefined) => Promise<Response>;

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

type MaybeOptionalArg<T> = RequiredKeys<T> extends never ? [config?: T] : [config: T];

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl: string = "";

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  parseResponse = async <T,>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }
    return response.text() as unknown as T;
  };

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<v.InferOutput<TEndpoint>["response"]> {
    return this.fetcher("get", this.baseUrl + path, params[0]).then((response) =>
      this.parseResponse(response),
    ) as Promise<v.InferOutput<TEndpoint>["response"]>;
  }
  // </ApiClient.get>

  // <ApiClient.put>
  put<Path extends keyof PutEndpoints, TEndpoint extends PutEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<v.InferOutput<TEndpoint>["response"]> {
    return this.fetcher("put", this.baseUrl + path, params[0]).then((response) =>
      this.parseResponse(response),
    ) as Promise<v.InferOutput<TEndpoint>["response"]>;
  }
  // </ApiClient.put>

  // <ApiClient.delete>
  delete<Path extends keyof DeleteEndpoints, TEndpoint extends DeleteEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<v.InferOutput<TEndpoint>["response"]> {
    return this.fetcher("delete", this.baseUrl + path, params[0]).then((response) =>
      this.parseResponse(response),
    ) as Promise<v.InferOutput<TEndpoint>["response"]>;
  }
  // </ApiClient.delete>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<v.InferOutput<TEndpoint>["response"]> {
    return this.fetcher("post", this.baseUrl + path, params[0]).then((response) =>
      this.parseResponse(response),
    ) as Promise<v.InferOutput<TEndpoint>["response"]>;
  }
  // </ApiClient.post>

  // <ApiClient.request>
  /**
   * Generic request method with full type-safety for any endpoint
   */
  request<
    TMethod extends keyof EndpointByMethod,
    TPath extends keyof EndpointByMethod[TMethod],
    TEndpoint extends EndpointByMethod[TMethod][TPath],
  >(
    method: TMethod,
    path: TPath,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<
    Omit<Response, "json"> & {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
      json: () => Promise<TEndpoint extends { response: infer Res } ? Res : never>;
    }
  > {
    return this.fetcher(method, this.baseUrl + (path as string), params[0] as EndpointParameters);
  }
  // </ApiClient.request>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? "");
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
