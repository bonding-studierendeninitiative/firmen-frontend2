import * as v from "valibot";

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

export type GetEventBuyOptionOutput = v.InferOutput<typeof GetEventBuyOptionOutput>;
export const GetEventBuyOptionOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  packages: v.optional(v.array(PackageV3Output)),
  services: v.optional(v.array(ServiceOutput)),
  eventDays: v.optional(v.array(EventDayOutput)),
  active: v.optional(v.boolean()),
  allowedSignUpDays: v.optional(v.number()),
});

export type EventDayInput = v.InferOutput<typeof EventDayInput>;
export const EventDayInput = v.object({
  dayDate: v.optional(v.string()),
  remainingCapacity: v.optional(v.number()),
  totalCapacity: v.optional(v.number()),
});

export type PackageBenefitInput = v.InferOutput<typeof PackageBenefitInput>;
export const PackageBenefitInput = v.object({
  numericValue: v.optional(v.number()),
  stringValue: v.optional(v.string()),
  booleanValue: v.optional(v.boolean()),
});

export type PackageInput = v.InferOutput<typeof PackageInput>;
export const PackageInput = v.object({
  name: v.string(),
  price: v.number(),
  benefits: v.array(PackageBenefitInput),
});

export type ServiceInput = v.InferOutput<typeof ServiceInput>;
export const ServiceInput = v.object({
  name: v.string(),
  description: v.optional(v.union([v.string(), v.undefined()])),
  valueType: v.union([v.literal("STRING"), v.literal("INTEGER"), v.literal("BOOLEAN")]),
});

export type UpdateEventBuyOptionInput = v.InferOutput<typeof UpdateEventBuyOptionInput>;
export const UpdateEventBuyOptionInput = v.object({
  packages: v.optional(v.union([v.array(PackageInput), v.undefined()])),
  services: v.optional(v.union([v.array(ServiceInput), v.undefined()])),
  eventDays: v.optional(v.union([v.array(EventDayInput), v.undefined()])),
  name: v.string(),
  allowedSignUpDays: v.optional(v.union([v.number(), v.undefined()])),
});

export type StatusType = v.InferOutput<typeof StatusType>;
export const StatusType = v.object({
  reasonPhrase: v.optional(v.string()),
  statusCode: v.optional(v.number()),
});

export type Problem = v.InferOutput<typeof Problem>;
export const Problem = v.object({
  parameters: v.optional(v.record(v.string(), v.unknown())),
  instance: v.optional(v.string()),
  type: v.optional(v.string()),
  detail: v.optional(v.string()),
  title: v.optional(v.string()),
  status: v.optional(StatusType),
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

export type EditAddonPackageOutput = v.InferOutput<typeof EditAddonPackageOutput>;
export const EditAddonPackageOutput = v.object({
  savedAddonPackage: v.optional(AddonPackageOutput),
});

export type AddonInput = v.InferOutput<typeof AddonInput>;
export const AddonInput = v.object({
  title: v.string(),
  description: v.string(),
  price: v.number(),
  label: v.string(),
});

export type EditAddonPackageInput = v.InferOutput<typeof EditAddonPackageInput>;
export const EditAddonPackageInput = v.object({
  eventId: v.string(),
  buyOptionId: v.string(),
  addonPackageId: v.string(),
  purchasable: v.boolean(),
  title: v.string(),
  label: v.string(),
  description: v.string(),
  price: v.number(),
  addons: v.array(AddonInput),
});

export type ReviewCatalogueDataInput = v.InferOutput<typeof ReviewCatalogueDataInput>;
export const ReviewCatalogueDataInput = v.object({
  documentChangeType: v.union([
    v.literal("upload"),
    v.literal("confirmation"),
    v.literal("rejection"),
    v.literal("change-request"),
    v.literal("thumbs-done"),
  ]),
  feedback: v.string(),
});

export type BaseDocumentOutput = v.InferOutput<typeof BaseDocumentOutput>;
export const BaseDocumentOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  documentType: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  organizationId: v.optional(v.string()),
});

export type DocumentFeedbackOutput = v.InferOutput<typeof DocumentFeedbackOutput>;
export const DocumentFeedbackOutput = v.object({
  feedbackType: v.optional(v.string()),
  message: v.optional(v.string()),
  timestamp: v.optional(v.string()),
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
  document: v.optional(BaseDocumentOutput),
  createdAt: v.optional(v.string()),
  modifiedAt: v.optional(v.string()),
  history: v.optional(v.array(DocumentFeedbackOutput)),
});

export type AdminRegistrationDocumentOutput = v.InferOutput<typeof AdminRegistrationDocumentOutput>;
export const AdminRegistrationDocumentOutput = v.object({
  id: v.optional(v.string()),
  documentVersion: v.optional(DetailedDocumentVersionOutput),
  status: v.optional(
    v.union([v.literal("unreviewed"), v.literal("changes-requested"), v.literal("rejected"), v.literal("confirmed")]),
  ),
  documentType: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  reviewer: v.optional(v.string()),
  reviewComments: v.optional(v.string()),
  requestedChanges: v.optional(v.string()),
});

export type ReviewDocumentOutput = v.InferOutput<typeof ReviewDocumentOutput>;
export const ReviewDocumentOutput = v.object({
  documentOutput: v.optional(AdminRegistrationDocumentOutput),
});

export type BillingAddressTemplateInput = v.InferOutput<typeof BillingAddressTemplateInput>;
export const BillingAddressTemplateInput = v.object({
  street: v.string(),
  country: v.string(),
  zipCode: v.string(),
  city: v.string(),
  vat: v.string(),
  billingReference: v.string(),
});

export type ImportLegacyOrganizationRequest = v.InferOutput<typeof ImportLegacyOrganizationRequest>;
export const ImportLegacyOrganizationRequest = v.object({
  organizationName: v.optional(v.string()),
  contactPeople: v.optional(v.array(v.string())),
  adminContactPerson: v.optional(v.string()),
  createAddress: v.optional(v.boolean()),
  billingAddress: v.optional(BillingAddressTemplateInput),
});

export type TimeoutHandler = v.InferOutput<typeof TimeoutHandler>;
export const TimeoutHandler = v.unknown();

export type AsyncResponse = v.InferOutput<typeof AsyncResponse>;
export const AsyncResponse = v.object({
  suspended: v.optional(v.boolean()),
  done: v.optional(v.boolean()),
  cancelled: v.optional(v.boolean()),
  timeoutHandler: v.optional(TimeoutHandler),
});

export type ExportLogosEnqueuedRequest = v.InferOutput<typeof ExportLogosEnqueuedRequest>;
export const ExportLogosEnqueuedRequest = v.object({
  eventRegistrationIds: v.optional(v.array(v.string())),
});

export type ExportLogosEnqueuedResponse = v.InferOutput<typeof ExportLogosEnqueuedResponse>;
export const ExportLogosEnqueuedResponse = v.object({
  status: v.optional(v.string()),
  jobId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type ExportAdvertisementsEnqueuedResponse = v.InferOutput<typeof ExportAdvertisementsEnqueuedResponse>;
export const ExportAdvertisementsEnqueuedResponse = v.object({
  status: v.optional(v.string()),
  jobId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type ExportAdvertisementsEnqueuedRequest = v.InferOutput<typeof ExportAdvertisementsEnqueuedRequest>;
export const ExportAdvertisementsEnqueuedRequest = v.object({
  eventRegistrationIds: v.optional(v.array(v.string())),
});

export type CreateEventBuyOptionInput = v.InferOutput<typeof CreateEventBuyOptionInput>;
export const CreateEventBuyOptionInput = v.object({
  packageCount: v.optional(v.union([v.number(), v.undefined()])),
  serviceCount: v.optional(v.union([v.number(), v.undefined()])),
  name: v.string(),
});

export type AddAddonPackageOutput = v.InferOutput<typeof AddAddonPackageOutput>;
export const AddAddonPackageOutput = v.object({
  savedAddonPackage: v.optional(AddonPackageOutput),
});

export type AddonPackageInput = v.InferOutput<typeof AddonPackageInput>;
export const AddonPackageInput = v.object({
  purchasable: v.boolean(),
  title: v.string(),
  price: v.optional(v.union([v.number(), v.undefined()])),
  description: v.optional(v.union([v.string(), v.undefined()])),
  label: v.string(),
  addons: v.array(AddonInput),
});

export type AddAddonPackageInput = v.InferOutput<typeof AddAddonPackageInput>;
export const AddAddonPackageInput = v.object({
  addonPackage: v.optional(AddonPackageInput),
});

export type RegisterOrganizationToEventOutput = v.InferOutput<typeof RegisterOrganizationToEventOutput>;
export const RegisterOrganizationToEventOutput = v.object({
  eventRegistrationId: v.optional(v.string()),
  createdAt: v.optional(v.string()),
});

export type AdminRegisterOrganizationToEventInput = v.InferOutput<typeof AdminRegisterOrganizationToEventInput>;
export const AdminRegisterOrganizationToEventInput = v.object({
  eventId: v.string(),
  organizationId: v.string(),
  contactPeople: v.array(v.string()),
  canUploadAdvertisement: v.boolean(),
  confirmedRegistration: v.boolean(),
});

export type SimpleLegacyOrganization = v.InferOutput<typeof SimpleLegacyOrganization>;
export const SimpleLegacyOrganization = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  publicName: v.optional(v.string()),
  fullName: v.optional(v.string()),
  shortName: v.optional(v.string()),
});

export type PagedLegacyOrganizationResponse = v.InferOutput<typeof PagedLegacyOrganizationResponse>;
export const PagedLegacyOrganizationResponse = v.object({
  organizations: v.optional(v.array(SimpleLegacyOrganization)),
  totalElements: v.optional(v.number()),
  totalPages: v.optional(v.number()),
});

export type SimpleLegacyOrganizationAddress = v.InferOutput<typeof SimpleLegacyOrganizationAddress>;
export const SimpleLegacyOrganizationAddress = v.object({
  addressType: v.optional(v.string()),
  location: v.optional(v.string()),
  postCode: v.optional(v.string()),
  country: v.optional(v.string()),
  pob: v.optional(v.string()),
  pobplz: v.optional(v.string()),
  phone: v.optional(v.string()),
  street: v.optional(v.string()),
});

export type SimpleLegacyContactPerson = v.InferOutput<typeof SimpleLegacyContactPerson>;
export const SimpleLegacyContactPerson = v.object({
  legacyId: v.string(),
  department: v.optional(v.union([v.string(), v.undefined()])),
  remarks: v.optional(v.union([v.string(), v.undefined()])),
  foek: v.optional(v.union([v.string(), v.undefined()])),
  fax: v.optional(v.union([v.string(), v.undefined()])),
  gender: v.optional(v.union([v.string(), v.undefined()])),
  email: v.optional(v.union([v.string(), v.undefined()])),
  phone2: v.optional(v.union([v.string(), v.undefined()])),
  lastName: v.optional(v.union([v.string(), v.undefined()])),
  position: v.optional(v.union([v.string(), v.undefined()])),
  phone: v.optional(v.union([v.string(), v.undefined()])),
  title: v.optional(v.union([v.string(), v.undefined()])),
  firstName: v.optional(v.union([v.string(), v.undefined()])),
  responsible: v.optional(v.union([v.string(), v.undefined()])),
  language: v.optional(v.union([v.string(), v.undefined()])),
});

export type DetailedLegacyOrganization = v.InferOutput<typeof DetailedLegacyOrganization>;
export const DetailedLegacyOrganization = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  publicname: v.optional(v.string()),
  fullname: v.optional(v.string()),
  shortname: v.optional(v.string()),
  email: v.optional(v.string()),
  fax: v.optional(v.string()),
  foek: v.optional(v.string()),
  internet: v.optional(v.string()),
  corporation: v.optional(v.string()),
  supplierType: v.optional(v.string()),
  address: v.optional(SimpleLegacyOrganizationAddress),
  contactPeople: v.optional(v.array(SimpleLegacyContactPerson)),
});

export type JobOutput = v.InferOutput<typeof JobOutput>;
export const JobOutput = v.object({
  status: v.optional(v.string()),
  name: v.optional(v.string()),
});

export type PagedJobOutput = v.InferOutput<typeof PagedJobOutput>;
export const PagedJobOutput = v.object({
  jobs: v.optional(v.array(JobOutput)),
  total: v.optional(v.number()),
  limit: v.optional(v.number()),
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

export type ExportOutput = v.InferOutput<typeof ExportOutput>;
export const ExportOutput = v.object({
  id: v.optional(v.string()),
  objectKey: v.optional(v.string()),
  type: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  event: v.optional(SimpleEventResponse),
  size: v.optional(v.number()),
  files: v.optional(v.number()),
  createdAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
});

export type PagedExportsOutput = v.InferOutput<typeof PagedExportsOutput>;
export const PagedExportsOutput = v.object({
  exports: v.optional(v.array(ExportOutput)),
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
  registrationDocuments: v.optional(v.array(AdminRegistrationDocumentOutput)),
  desiredEventRegistrationDays: v.optional(v.array(v.string())),
  organizationId: v.optional(v.string()),
  contactPeople: v.optional(v.array(v.string())),
});

export type GetEventRegistrationsForEventOutput = v.InferOutput<typeof GetEventRegistrationsForEventOutput>;
export const GetEventRegistrationsForEventOutput = v.object({
  eventRegistrations: v.optional(v.array(GetEventRegistrationForEventOutput)),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
});

export type SimpleBuyOptionResponse = v.InferOutput<typeof SimpleBuyOptionResponse>;
export const SimpleBuyOptionResponse = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  packagesCount: v.optional(v.number()),
  servicesCount: v.optional(v.number()),
  eventDaysCount: v.optional(v.number()),
  active: v.optional(v.boolean()),
});

export type GetEventBuyOptionsOutput = v.InferOutput<typeof GetEventBuyOptionsOutput>;
export const GetEventBuyOptionsOutput = v.object({
  eventId: v.optional(v.string()),
  buyOptions: v.optional(v.array(SimpleBuyOptionResponse)),
  pageNumber: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  totalElements: v.optional(v.number()),
  totalPages: v.optional(v.number()),
});

export type GetAllAddonPackagesOutput = v.InferOutput<typeof GetAllAddonPackagesOutput>;
export const GetAllAddonPackagesOutput = v.object({
  addonPackages: v.optional(v.array(AddonPackageOutput)),
  totalElements: v.optional(v.number()),
});

export type GetAddonPackageOutput = v.InferOutput<typeof GetAddonPackageOutput>;
export const GetAddonPackageOutput = v.object({
  id: v.optional(v.string()),
  purchasable: v.optional(v.boolean()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
  eventId: v.optional(v.string()),
  addons: v.optional(v.array(AddonOutput)),
});

export type __ENDPOINTS_START__ = v.InferOutput<typeof __ENDPOINTS_START__>;
export const __ENDPOINTS_START__ = v.object({});

export type get_GetEventBuyOption = v.InferOutput<typeof get_GetEventBuyOption>;
export const get_GetEventBuyOption = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
    }),
  }),
  response: GetEventBuyOptionOutput,
});

export type put_UpdateBuyOption = v.InferOutput<typeof put_UpdateBuyOption>;
export const put_UpdateBuyOption = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
    }),
    body: UpdateEventBuyOptionInput,
  }),
  response: GetEventBuyOptionOutput,
});

export type delete_DeleteEventBuyOption = v.InferOutput<typeof delete_DeleteEventBuyOption>;
export const delete_DeleteEventBuyOption = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetAddonPackage = v.InferOutput<typeof get_GetAddonPackage>;
export const get_GetAddonPackage = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      includeAddons: v.optional(v.boolean()),
    }),
    path: v.object({
      addonPackageId: v.string(),
      buyOptionId: v.string(),
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_EditAddonPackage = v.InferOutput<typeof put_EditAddonPackage>;
export const put_EditAddonPackage = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
      addonPackageId: v.string(),
    }),
    body: EditAddonPackageInput,
  }),
  response: EditAddonPackageOutput,
});

export type delete_DeleteAddonPackage = v.InferOutput<typeof delete_DeleteAddonPackage>;
export const delete_DeleteAddonPackage = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      addonPackageId: v.string(),
      buyOptionId: v.string(),
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_ReviewDocument = v.InferOutput<typeof post_ReviewDocument>;
export const post_ReviewDocument = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/registration-document/{registrationDocumentId}/review"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      registrationDocumentId: v.string(),
    }),
    body: ReviewCatalogueDataInput,
  }),
  response: ReviewDocumentOutput,
});

export type post_ImportLegacyOrganization = v.InferOutput<typeof post_ImportLegacyOrganization>;
export const post_ImportLegacyOrganization = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/organization/{id}/import"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      id: v.string(),
    }),
    body: ImportLegacyOrganizationRequest,
  }),
  response: v.unknown(),
});

export type post_RestartJob = v.InferOutput<typeof post_RestartJob>;
export const post_RestartJob = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/jobs/{jobId}/restart"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      asyncResponse: v.object({
        suspended: v.optional(v.boolean()),
        done: v.optional(v.boolean()),
        cancelled: v.optional(v.boolean()),
        timeoutHandler: v.optional(TimeoutHandler),
      }),
    }),
    path: v.object({
      jobId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_ImportEvents = v.InferOutput<typeof post_ImportEvents>;
export const post_ImportEvents = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/jobs/import/events"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      asyncResponse: v.object({
        suspended: v.optional(v.boolean()),
        done: v.optional(v.boolean()),
        cancelled: v.optional(v.boolean()),
        timeoutHandler: v.optional(TimeoutHandler),
      }),
    }),
  }),
  response: v.unknown(),
});

export type post_ExportLogos = v.InferOutput<typeof post_ExportLogos>;
export const post_ExportLogos = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/jobs/export/logos"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: ExportLogosEnqueuedRequest,
  }),
  response: v.unknown(),
});

export type post_ExportAdvertisements = v.InferOutput<typeof post_ExportAdvertisements>;
export const post_ExportAdvertisements = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/jobs/export/advertisements"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: ExportAdvertisementsEnqueuedRequest,
  }),
  response: ExportAdvertisementsEnqueuedResponse,
});

export type post_PublishEvent = v.InferOutput<typeof post_PublishEvent>;
export const post_PublishEvent = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/publish"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetEventBuysOption = v.InferOutput<typeof get_GetEventBuysOption>;
export const get_GetEventBuysOption = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      sortDirection: v.optional(v.string()),
      sortBy: v.optional(v.string()),
      page: v.optional(v.number()),
      size: v.optional(v.number()),
    }),
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: GetEventBuyOptionsOutput,
});

export type post_CreateEventBuyOption = v.InferOutput<typeof post_CreateEventBuyOption>;
export const post_CreateEventBuyOption = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
    body: CreateEventBuyOptionInput,
  }),
  response: GetEventBuyOptionOutput,
});

export type get_GetAllAddonPackages = v.InferOutput<typeof get_GetAllAddonPackages>;
export const get_GetAllAddonPackages = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
      sortBy: v.optional(v.string()),
      sortDirection: v.optional(v.string()),
    }),
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
    }),
  }),
  response: GetAllAddonPackagesOutput,
});

export type post_AddAddonPackage = v.InferOutput<typeof post_AddAddonPackage>;
export const post_AddAddonPackage = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
    }),
    body: AddAddonPackageInput,
  }),
  response: AddAddonPackageOutput,
});

export type post_ActivateEventBuyOption = v.InferOutput<typeof post_ActivateEventBuyOption>;
export const post_ActivateEventBuyOption = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/activate"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      buyOptionId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_CreateEventRegistration = v.InferOutput<typeof post_CreateEventRegistration>;
export const post_CreateEventRegistration = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event-registration"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: AdminRegisterOrganizationToEventInput,
  }),
  response: RegisterOrganizationToEventOutput,
});

export type post_RejectEventRegistration = v.InferOutput<typeof post_RejectEventRegistration>;
export const post_RejectEventRegistration = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event-registration/{eventRegistrationId}/reject"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_ConfirmEventRegistration = v.InferOutput<typeof post_ConfirmEventRegistration>;
export const post_ConfirmEventRegistration = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event-registration/{eventRegistrationId}/confirm"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_GetAllLegacyOrganizations = v.InferOutput<typeof get_GetAllLegacyOrganizations>;
export const get_GetAllLegacyOrganizations = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/organization"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.number()),
      size: v.optional(v.number()),
      query: v.optional(v.string()),
    }),
  }),
  response: PagedLegacyOrganizationResponse,
});

export type get_GetLegacyOrganization = v.InferOutput<typeof get_GetLegacyOrganization>;
export const get_GetLegacyOrganization = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/organization/{id}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      id: v.string(),
    }),
  }),
  response: DetailedLegacyOrganization,
});

export type get_GetJobs = v.InferOutput<typeof get_GetJobs>;
export const get_GetJobs = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/jobs"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      stateName: v.string(),
      limit: v.optional(v.union([v.number(), v.undefined()])),
      offset: v.optional(v.union([v.number(), v.undefined()])),
    }),
  }),
  response: PagedJobOutput,
});

export type get_GetJobDetails = v.InferOutput<typeof get_GetJobDetails>;
export const get_GetJobDetails = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/jobs/{jobId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      jobId: v.string(),
    }),
  }),
  response: JobOutput,
});

export type get_GetExports = v.InferOutput<typeof get_GetExports>;
export const get_GetExports = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/events/{eventId}/exports"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: PagedExportsOutput,
});

export type get_GetDownloadUrl = v.InferOutput<typeof get_GetDownloadUrl>;
export const get_GetDownloadUrl = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/events/{eventId}/exports/{exportId}/download"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      exportId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type get_LoadAll = v.InferOutput<typeof get_LoadAll>;
export const get_LoadAll = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      sortDirection: v.optional(v.string()),
      sortBy: v.optional(v.string()),
      page: v.optional(v.number()),
      size: v.optional(v.number()),
      event_status: v.optional(
        v.array(v.union([v.literal("UNPUBLISHED"), v.literal("PUBLISHED"), v.literal("ARCHIVED")])),
      ),
    }),
  }),
  response: AllEventsOutput,
});

export type get_LoadEventRegistrationsForEvent = v.InferOutput<typeof get_LoadEventRegistrationsForEvent>;
export const get_LoadEventRegistrationsForEvent = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/event_registrations"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.optional(v.number()),
      size: v.optional(v.number()),
      sortDirection: v.optional(v.string()),
      sortBy: v.optional(v.string()),
    }),
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: GetEventRegistrationsForEventOutput,
});

export type delete_DeleteEventRegistration = v.InferOutput<typeof delete_DeleteEventRegistration>;
export const delete_DeleteEventRegistration = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/event-registration/{eventRegistrationId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventRegistrationId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type __ENDPOINTS_END__ = v.InferOutput<typeof __ENDPOINTS_END__>;
export const __ENDPOINTS_END__ = v.object({});

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}": get_GetEventBuyOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": get_GetAddonPackage,
    "/api/v2/admin/event/{eventId}/buy-option": get_GetEventBuysOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package": get_GetAllAddonPackages,
    "/api/v2/admin/organization": get_GetAllLegacyOrganizations,
    "/api/v2/admin/organization/{id}": get_GetLegacyOrganization,
    "/api/v2/admin/jobs": get_GetJobs,
    "/api/v2/admin/jobs/{jobId}": get_GetJobDetails,
    "/api/v2/admin/events/{eventId}/exports": get_GetExports,
    "/api/v2/admin/events/{eventId}/exports/{exportId}/download": get_GetDownloadUrl,
    "/api/v2/admin/event": get_LoadAll,
    "/api/v2/admin/event/{eventId}/event_registrations": get_LoadEventRegistrationsForEvent,
  },
  put: {
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}": put_UpdateBuyOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": put_EditAddonPackage,
  },
  delete: {
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}": delete_DeleteEventBuyOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": delete_DeleteAddonPackage,
    "/api/v2/admin/event-registration/{eventRegistrationId}": delete_DeleteEventRegistration,
  },
  post: {
    "/api/v2/admin/registration-document/{registrationDocumentId}/review": post_ReviewDocument,
    "/api/v2/admin/organization/{id}/import": post_ImportLegacyOrganization,
    "/api/v2/admin/jobs/{jobId}/restart": post_RestartJob,
    "/api/v2/admin/jobs/import/events": post_ImportEvents,
    "/api/v2/admin/jobs/export/logos": post_ExportLogos,
    "/api/v2/admin/jobs/export/advertisements": post_ExportAdvertisements,
    "/api/v2/admin/event/{eventId}/publish": post_PublishEvent,
    "/api/v2/admin/event/{eventId}/buy-option": post_CreateEventBuyOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package": post_AddAddonPackage,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/activate": post_ActivateEventBuyOption,
    "/api/v2/admin/event-registration": post_CreateEventRegistration,
    "/api/v2/admin/event-registration/{eventRegistrationId}/reject": post_RejectEventRegistration,
    "/api/v2/admin/event-registration/{eventRegistrationId}/confirm": post_ConfirmEventRegistration,
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
