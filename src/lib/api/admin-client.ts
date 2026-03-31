import * as v from "valibot";

export type EmailDraftDTO_Simple = v.InferOutput<typeof EmailDraftDTO_Simple>;
export const EmailDraftDTO_Simple = v.object({
  subject: v.string(),
  bodyMarkdown: v.optional(v.union([v.string(), v.undefined()])),
  replyToEmail: v.optional(v.union([v.string(), v.undefined()])),
});

export type StatusType_Simple = v.InferOutput<typeof StatusType_Simple>;
export const StatusType_Simple = v.object({
  reasonPhrase: v.optional(v.string()),
  statusCode: v.optional(v.number()),
});

export type Problem_Simple = v.InferOutput<typeof Problem_Simple>;
export const Problem_Simple = v.object({
  title: v.optional(v.string()),
  status: v.optional(StatusType_Simple),
  detail: v.optional(v.string()),
  instance: v.optional(v.string()),
  type: v.optional(v.string()),
  parameters: v.optional(v.record(v.string(), v.unknown())),
});

export type EmailDraftOutput_Simple = v.InferOutput<typeof EmailDraftOutput_Simple>;
export const EmailDraftOutput_Simple = v.object({
  id: v.optional(v.string()),
  subject: v.optional(v.string()),
  lastModifiedBy: v.optional(v.string()),
  lastModifiedDate: v.optional(v.string()),
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

export type StatusType = v.InferOutput<typeof StatusType>;
export const StatusType = v.object({
  reasonPhrase: v.optional(v.string()),
  statusCode: v.optional(v.number()),
});

export type Problem = v.InferOutput<typeof Problem>;
export const Problem = v.object({
  title: v.optional(v.string()),
  status: v.optional(StatusType),
  detail: v.optional(v.string()),
  instance: v.optional(v.string()),
  type: v.optional(v.string()),
  parameters: v.optional(v.record(v.string(), v.unknown())),
});

export type UpdateServiceInput = v.InferOutput<typeof UpdateServiceInput>;
export const UpdateServiceInput = v.object({
  name: v.string(),
  description: v.optional(v.union([v.string(), v.undefined()])),
  valueType: v.union([v.literal("STRING"), v.literal("INTEGER"), v.literal("BOOLEAN")]),
  version: v.number(),
});

export type CopyOnWriteMetadata = v.InferOutput<typeof CopyOnWriteMetadata>;
export const CopyOnWriteMetadata = v.object({
  occurred: v.optional(v.boolean()),
  originalBuyOptionId: v.optional(v.string()),
  newBuyOptionId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type UpdateServiceOutput = v.InferOutput<typeof UpdateServiceOutput>;
export const UpdateServiceOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  valueType: v.optional(v.string()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type UpdatePackageInput = v.InferOutput<typeof UpdatePackageInput>;
export const UpdatePackageInput = v.object({
  name: v.string(),
  price: v.number(),
  version: v.number(),
});

export type UpdatePackageOutput = v.InferOutput<typeof UpdatePackageOutput>;
export const UpdatePackageOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  price: v.optional(v.number()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type UpdateEventDayInput = v.InferOutput<typeof UpdateEventDayInput>;
export const UpdateEventDayInput = v.object({
  date: v.optional(v.union([v.string(), v.undefined()])),
  totalCapacity: v.optional(v.union([v.number(), v.undefined()])),
  version: v.number(),
});

export type UpdateEventDayOutput = v.InferOutput<typeof UpdateEventDayOutput>;
export const UpdateEventDayOutput = v.object({
  id: v.optional(v.string()),
  date: v.optional(v.string()),
  totalCapacity: v.optional(v.number()),
  remainingCapacity: v.optional(v.number()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type UpdateEventDayOrderInput = v.InferOutput<typeof UpdateEventDayOrderInput>;
export const UpdateEventDayOrderInput = v.object({
  order: v.number(),
  version: v.number(),
});

export type UpdateBenefitInput = v.InferOutput<typeof UpdateBenefitInput>;
export const UpdateBenefitInput = v.object({
  numericValue: v.optional(v.union([v.number(), v.undefined()])),
  stringValue: v.optional(v.union([v.string(), v.undefined()])),
  booleanValue: v.optional(v.union([v.boolean(), v.undefined()])),
  version: v.number(),
});

export type UpdateBenefitOutput = v.InferOutput<typeof UpdateBenefitOutput>;
export const UpdateBenefitOutput = v.object({
  id: v.optional(v.string()),
  serviceId: v.optional(v.string()),
  numericValue: v.optional(v.number()),
  stringValue: v.optional(v.string()),
  booleanValue: v.optional(v.boolean()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type UpdateAddonPackageInput = v.InferOutput<typeof UpdateAddonPackageInput>;
export const UpdateAddonPackageInput = v.object({
  title: v.optional(v.union([v.string(), v.undefined()])),
  price: v.optional(v.union([v.number(), v.undefined()])),
  label: v.optional(v.union([v.string(), v.undefined()])),
  description: v.optional(v.union([v.string(), v.undefined()])),
  purchasable: v.optional(v.union([v.boolean(), v.undefined()])),
  version: v.number(),
});

export type UpdateAddonPackageOutput = v.InferOutput<typeof UpdateAddonPackageOutput>;
export const UpdateAddonPackageOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
  description: v.optional(v.string()),
  purchasable: v.optional(v.boolean()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
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
  id: v.string(),
  title: v.optional(v.union([v.string(), v.undefined()])),
  documentType: v.optional(
    v.union([v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")]), v.undefined()]),
  ),
  organizationId: v.optional(v.union([v.string(), v.undefined()])),
});

export type DocumentFeedbackOutput = v.InferOutput<typeof DocumentFeedbackOutput>;
export const DocumentFeedbackOutput = v.object({
  feedbackType: v.optional(v.string()),
  message: v.optional(v.string()),
  timestamp: v.optional(v.string()),
});

export type DocumentVersionOutput = v.InferOutput<typeof DocumentVersionOutput>;
export const DocumentVersionOutput = v.object({
  versionId: v.string(),
  size: v.optional(v.union([v.number(), v.undefined()])),
  contentType: v.optional(v.union([v.string(), v.undefined()])),
  isLatest: v.optional(v.union([v.boolean(), v.undefined()])),
  uploadStatus: v.optional(
    v.union([
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
      v.undefined(),
    ]),
  ),
  document: BaseDocumentOutput,
  createdAt: v.optional(v.union([v.string(), v.undefined()])),
  modifiedAt: v.optional(v.union([v.string(), v.undefined()])),
  history: v.optional(v.union([v.array(DocumentFeedbackOutput), v.undefined()])),
});

export type AdminRegistrationDocumentOutput = v.InferOutput<typeof AdminRegistrationDocumentOutput>;
export const AdminRegistrationDocumentOutput = v.object({
  id: v.optional(v.string()),
  documentVersion: v.optional(DocumentVersionOutput),
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

export type NotesIdRequest_Detailed = v.InferOutput<typeof NotesIdRequest_Detailed>;
export const NotesIdRequest_Detailed = v.object({
  notesIds: v.optional(v.array(v.string())),
});

export type SimpleLegacyOrganizationAddress_Detailed = v.InferOutput<typeof SimpleLegacyOrganizationAddress_Detailed>;
export const SimpleLegacyOrganizationAddress_Detailed = v.object({
  addressType: v.optional(v.string()),
  location: v.optional(v.string()),
  postCode: v.optional(v.string()),
  country: v.optional(v.string()),
  pob: v.optional(v.string()),
  pobplz: v.optional(v.string()),
  phone: v.optional(v.string()),
  street: v.optional(v.string()),
});

export type SimpleLegacyContactPerson_Detailed = v.InferOutput<typeof SimpleLegacyContactPerson_Detailed>;
export const SimpleLegacyContactPerson_Detailed = v.object({
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

export type LegacyOrganizationOutput_Detailed = v.InferOutput<typeof LegacyOrganizationOutput_Detailed>;
export const LegacyOrganizationOutput_Detailed = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  publicName: v.optional(v.string()),
  fullName: v.optional(v.string()),
  shortName: v.optional(v.string()),
  email: v.optional(v.string()),
  fax: v.optional(v.string()),
  foek: v.optional(v.string()),
  internet: v.optional(v.string()),
  corporation: v.optional(v.string()),
  supplierType: v.optional(v.string()),
  address: v.optional(SimpleLegacyOrganizationAddress_Detailed),
  contactPeople: v.optional(v.array(SimpleLegacyContactPerson_Detailed)),
  contactPeopleCount: v.optional(v.number()),
  notesId: v.optional(v.string()),
});

export type BulkLegacyOrganizationsOutput_Detailed = v.InferOutput<typeof BulkLegacyOrganizationsOutput_Detailed>;
export const BulkLegacyOrganizationsOutput_Detailed = v.object({
  legacyOrganizations: v.optional(v.array(LegacyOrganizationOutput_Detailed)),
});

export type TimeoutHandler = v.InferOutput<typeof TimeoutHandler>;
export const TimeoutHandler = v.unknown();

export type AsyncResponse = v.InferOutput<typeof AsyncResponse>;
export const AsyncResponse = v.object({
  suspended: v.optional(v.boolean()),
  timeoutHandler: v.optional(TimeoutHandler),
  done: v.optional(v.boolean()),
  cancelled: v.optional(v.boolean()),
});

export type ExportPortraitsEnqueuedResponse = v.InferOutput<typeof ExportPortraitsEnqueuedResponse>;
export const ExportPortraitsEnqueuedResponse = v.object({
  status: v.optional(v.string()),
  jobId: v.optional(v.string()),
  exportId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type ExportPortraitsEnqueuedRequest = v.InferOutput<typeof ExportPortraitsEnqueuedRequest>;
export const ExportPortraitsEnqueuedRequest = v.object({
  eventRegistrationIds: v.optional(v.array(v.string())),
});

export type ExportLogosEnqueuedRequest = v.InferOutput<typeof ExportLogosEnqueuedRequest>;
export const ExportLogosEnqueuedRequest = v.object({
  eventRegistrationIds: v.optional(v.array(v.string())),
});

export type ExportLogosEnqueuedResponse = v.InferOutput<typeof ExportLogosEnqueuedResponse>;
export const ExportLogosEnqueuedResponse = v.object({
  status: v.optional(v.string()),
  jobId: v.optional(v.string()),
  exportId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type ExportAdvertisementsEnqueuedResponse = v.InferOutput<typeof ExportAdvertisementsEnqueuedResponse>;
export const ExportAdvertisementsEnqueuedResponse = v.object({
  status: v.optional(v.string()),
  jobId: v.optional(v.string()),
  exportId: v.optional(v.string()),
  message: v.optional(v.string()),
});

export type ExportAdvertisementsEnqueuedRequest = v.InferOutput<typeof ExportAdvertisementsEnqueuedRequest>;
export const ExportAdvertisementsEnqueuedRequest = v.object({
  eventRegistrationIds: v.optional(v.array(v.string())),
});

export type RecipientSelectionDTO = v.InferOutput<typeof RecipientSelectionDTO>;
export const RecipientSelectionDTO = v.object({
  registrationIds: v.optional(v.array(v.string())),
  organizationIds: v.optional(v.array(v.string())),
  userIds: v.optional(v.array(v.string())),
});

export type TestEmailRequestDTO = v.InferOutput<typeof TestEmailRequestDTO>;
export const TestEmailRequestDTO = v.object({
  subject: v.string(),
  bodyMarkdown: v.string(),
  replyToEmail: v.optional(v.union([v.string(), v.undefined()])),
  testEmailAddress: v.string(),
  recipientSelection: v.optional(v.union([RecipientSelectionDTO, v.undefined()])),
});

export type SendBulkEmailResponseDTO = v.InferOutput<typeof SendBulkEmailResponseDTO>;
export const SendBulkEmailResponseDTO = v.object({
  jobId: v.optional(v.string()),
  recipientCount: v.optional(v.number()),
  status: v.optional(
    v.union([v.literal("QUEUED"), v.literal("IN_PROGRESS"), v.literal("COMPLETED"), v.literal("FAILED")]),
  ),
});

export type EmailSendRequestDTO = v.InferOutput<typeof EmailSendRequestDTO>;
export const EmailSendRequestDTO = v.object({
  recipients: RecipientSelectionDTO,
  confirmDuplicateSend: v.optional(v.union([v.boolean(), v.undefined()])),
});

export type EmailRecipient = v.InferOutput<typeof EmailRecipient>;
export const EmailRecipient = v.object({
  userId: v.optional(v.string()),
  email: v.optional(v.string()),
  contactName: v.optional(v.string()),
  organizationId: v.optional(v.string()),
  organizationName: v.optional(v.string()),
  packageName: v.optional(v.string()),
  registrationId: v.optional(v.string()),
});

export type PreviewResult = v.InferOutput<typeof PreviewResult>;
export const PreviewResult = v.object({
  recipient: v.optional(EmailRecipient),
  subject: v.optional(v.string()),
  bodyHtml: v.optional(v.string()),
});

export type PreviewBulkEmailOutput = v.InferOutput<typeof PreviewBulkEmailOutput>;
export const PreviewBulkEmailOutput = v.object({
  previews: v.optional(v.array(PreviewResult)),
});

export type CreateEventBuyOptionInput = v.InferOutput<typeof CreateEventBuyOptionInput>;
export const CreateEventBuyOptionInput = v.object({
  packageCount: v.optional(v.union([v.number(), v.undefined()])),
  serviceCount: v.optional(v.union([v.number(), v.undefined()])),
  name: v.string(),
});

export type EventDayOutput = v.InferOutput<typeof EventDayOutput>;
export const EventDayOutput = v.object({
  id: v.optional(v.string()),
  dayDate: v.optional(v.string()),
  totalCapacity: v.optional(v.number()),
  remainingCapacity: v.optional(v.number()),
});

export type PackageV3Output = v.InferOutput<typeof PackageV3Output>;
export const PackageV3Output = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  price: v.optional(v.number()),
});

export type ServiceOutput = v.InferOutput<typeof ServiceOutput>;
export const ServiceOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  valueType: v.optional(v.string()),
});

export type PackageBenefitOutput = v.InferOutput<typeof PackageBenefitOutput>;
export const PackageBenefitOutput = v.object({
  id: v.optional(v.string()),
  serviceId: v.optional(v.string()),
  packageId: v.optional(v.string()),
  stringValue: v.optional(v.string()),
  numericValue: v.optional(v.number()),
  booleanValue: v.optional(v.boolean()),
});

export type GetEventBuyOptionOutput = v.InferOutput<typeof GetEventBuyOptionOutput>;
export const GetEventBuyOptionOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  packages: v.optional(v.array(PackageV3Output)),
  services: v.optional(v.array(ServiceOutput)),
  eventDays: v.optional(v.array(EventDayOutput)),
  benefits: v.optional(v.array(PackageBenefitOutput)),
  active: v.optional(v.boolean()),
  allowedSignUpDays: v.optional(v.number()),
  version: v.optional(v.number()),
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

export type CreateServiceOutput = v.InferOutput<typeof CreateServiceOutput>;
export const CreateServiceOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  valueType: v.optional(v.string()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type CreateServiceInput = v.InferOutput<typeof CreateServiceInput>;
export const CreateServiceInput = v.object({
  name: v.string(),
  description: v.optional(v.union([v.string(), v.undefined()])),
  valueType: v.union([v.literal("STRING"), v.literal("INTEGER"), v.literal("BOOLEAN")]),
  version: v.number(),
});

export type MoveServiceInput = v.InferOutput<typeof MoveServiceInput>;
export const MoveServiceInput = v.object({
  direction: v.union([v.literal("up"), v.literal("down")]),
  version: v.number(),
});

export type MoveServiceOutput = v.InferOutput<typeof MoveServiceOutput>;
export const MoveServiceOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  valueType: v.optional(v.string()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type CreatePackageInput = v.InferOutput<typeof CreatePackageInput>;
export const CreatePackageInput = v.object({
  name: v.string(),
  price: v.number(),
  version: v.number(),
});

export type CreatePackageOutput = v.InferOutput<typeof CreatePackageOutput>;
export const CreatePackageOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  price: v.optional(v.number()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type MovePackageInput = v.InferOutput<typeof MovePackageInput>;
export const MovePackageInput = v.object({
  direction: v.union([v.literal("up"), v.literal("down")]),
  version: v.number(),
});

export type MovePackageOutput = v.InferOutput<typeof MovePackageOutput>;
export const MovePackageOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  price: v.optional(v.number()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type CreateEventDayInput = v.InferOutput<typeof CreateEventDayInput>;
export const CreateEventDayInput = v.object({
  date: v.string(),
  totalCapacity: v.number(),
  version: v.number(),
});

export type CreateEventDayOutput = v.InferOutput<typeof CreateEventDayOutput>;
export const CreateEventDayOutput = v.object({
  id: v.optional(v.string()),
  date: v.optional(v.string()),
  totalCapacity: v.optional(v.number()),
  remainingCapacity: v.optional(v.number()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type CreateBenefitInput = v.InferOutput<typeof CreateBenefitInput>;
export const CreateBenefitInput = v.object({
  packageId: v.string(),
  serviceId: v.string(),
  numericValue: v.optional(v.union([v.number(), v.undefined()])),
  stringValue: v.optional(v.union([v.string(), v.undefined()])),
  booleanValue: v.optional(v.union([v.boolean(), v.undefined()])),
  version: v.number(),
});

export type CreateBenefitOutput = v.InferOutput<typeof CreateBenefitOutput>;
export const CreateBenefitOutput = v.object({
  id: v.optional(v.string()),
  serviceId: v.optional(v.string()),
  serviceName: v.optional(v.string()),
  numericValue: v.optional(v.number()),
  stringValue: v.optional(v.string()),
  booleanValue: v.optional(v.boolean()),
  order: v.optional(v.number()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type CreateAddonPackageInput = v.InferOutput<typeof CreateAddonPackageInput>;
export const CreateAddonPackageInput = v.object({
  title: v.string(),
  price: v.number(),
  label: v.optional(v.union([v.string(), v.undefined()])),
  description: v.optional(v.union([v.string(), v.undefined()])),
  purchasable: v.boolean(),
  version: v.number(),
});

export type CreateAddonPackageOutput = v.InferOutput<typeof CreateAddonPackageOutput>;
export const CreateAddonPackageOutput = v.object({
  id: v.optional(v.string()),
  title: v.optional(v.string()),
  price: v.optional(v.number()),
  label: v.optional(v.string()),
  description: v.optional(v.string()),
  purchasable: v.optional(v.boolean()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type ChangeBuyOptionNameInput = v.InferOutput<typeof ChangeBuyOptionNameInput>;
export const ChangeBuyOptionNameInput = v.object({
  name: v.string(),
  version: v.number(),
});

export type ChangeBuyOptionNameOutput = v.InferOutput<typeof ChangeBuyOptionNameOutput>;
export const ChangeBuyOptionNameOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  active: v.optional(v.boolean()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
});

export type ChangeAllowedSignUpDaysInput = v.InferOutput<typeof ChangeAllowedSignUpDaysInput>;
export const ChangeAllowedSignUpDaysInput = v.object({
  allowedSignUpDays: v.optional(v.union([v.number(), v.undefined()])),
  version: v.number(),
});

export type ChangeAllowedSignUpDaysOutput = v.InferOutput<typeof ChangeAllowedSignUpDaysOutput>;
export const ChangeAllowedSignUpDaysOutput = v.object({
  id: v.optional(v.string()),
  allowedSignUpDays: v.optional(v.number()),
  active: v.optional(v.boolean()),
  version: v.optional(v.number()),
  copyOnWrite: v.optional(CopyOnWriteMetadata),
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

export type LegacyOrganizationOutput = v.InferOutput<typeof LegacyOrganizationOutput>;
export const LegacyOrganizationOutput = v.object({
  id: v.optional(v.string()),
  name: v.optional(v.string()),
  publicName: v.optional(v.string()),
  fullName: v.optional(v.string()),
  shortName: v.optional(v.string()),
  email: v.optional(v.string()),
  fax: v.optional(v.string()),
  foek: v.optional(v.string()),
  internet: v.optional(v.string()),
  corporation: v.optional(v.string()),
  supplierType: v.optional(v.string()),
  address: v.optional(SimpleLegacyOrganizationAddress),
  contactPeople: v.optional(v.array(SimpleLegacyContactPerson)),
  contactPeopleCount: v.optional(v.number()),
  notesId: v.optional(v.string()),
});

export type PagedLegacyOrganizationResponse = v.InferOutput<typeof PagedLegacyOrganizationResponse>;
export const PagedLegacyOrganizationResponse = v.object({
  organizations: v.optional(v.array(LegacyOrganizationOutput)),
  totalElements: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  pageSize: v.optional(v.number()),
  pageNumber: v.optional(v.number()),
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

export type ExportForEventOutput = v.InferOutput<typeof ExportForEventOutput>;
export const ExportForEventOutput = v.object({
  id: v.optional(v.string()),
  objectKey: v.optional(v.string()),
  type: v.optional(v.union([v.literal("portrait"), v.literal("logo"), v.literal("advert")])),
  size: v.optional(v.number()),
  files: v.optional(v.number()),
  createdAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
  status: v.optional(v.union([v.literal("pending"), v.literal("completed"), v.literal("failed")])),
});

export type PagedExportsForEventOutput = v.InferOutput<typeof PagedExportsForEventOutput>;
export const PagedExportsForEventOutput = v.object({
  exports: v.optional(v.array(ExportForEventOutput)),
  totalElements: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  page: v.optional(v.number()),
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

export type AllEventsOutput = v.InferOutput<typeof AllEventsOutput>;
export const AllEventsOutput = v.object({
  data: v.optional(v.array(SimpleEventResponse)),
  page: v.optional(v.number()),
  size: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  totalElements: v.optional(v.number()),
  status: v.optional(v.array(v.union([v.literal("UNPUBLISHED"), v.literal("PUBLISHED"), v.literal("ARCHIVED")]))),
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
  timeFrom: v.optional(v.string()),
  dateTo: v.optional(v.string()),
  timeTo: v.optional(v.string()),
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

export type EmailJobStatusDTO = v.InferOutput<typeof EmailJobStatusDTO>;
export const EmailJobStatusDTO = v.object({
  jobId: v.optional(v.string()),
  status: v.optional(
    v.union([v.literal("QUEUED"), v.literal("IN_PROGRESS"), v.literal("COMPLETED"), v.literal("FAILED")]),
  ),
  recipientCount: v.optional(v.number()),
  successCount: v.optional(v.number()),
  failureCount: v.optional(v.number()),
  failureDetails: v.optional(v.string()),
  startedAt: v.optional(v.string()),
  completedAt: v.optional(v.string()),
});

export type GetDraftsOutput_Simple = v.InferOutput<typeof GetDraftsOutput_Simple>;
export const GetDraftsOutput_Simple = v.object({
  drafts: v.optional(v.array(EmailDraftOutput_Simple)),
  totalElements: v.optional(v.number()),
  totalPages: v.optional(v.number()),
  page: v.optional(v.number()),
  size: v.optional(v.number()),
});

export type StatusType_Detailed = v.InferOutput<typeof StatusType_Detailed>;
export const StatusType_Detailed = v.object({
  reasonPhrase: v.optional(v.string()),
  statusCode: v.optional(v.number()),
});

export type Problem_Detailed = v.InferOutput<typeof Problem_Detailed>;
export const Problem_Detailed = v.object({
  title: v.optional(v.string()),
  status: v.optional(StatusType_Detailed),
  detail: v.optional(v.string()),
  instance: v.optional(v.string()),
  type: v.optional(v.string()),
  parameters: v.optional(v.record(v.string(), v.unknown())),
});

export type EmailDraftOutput_Detailed = v.InferOutput<typeof EmailDraftOutput_Detailed>;
export const EmailDraftOutput_Detailed = v.object({
  id: v.optional(v.string()),
  eventId: v.optional(v.string()),
  subject: v.optional(v.string()),
  bodyMarkdown: v.optional(v.string()),
  replyToEmail: v.optional(v.string()),
  createdBy: v.optional(v.string()),
  creationDate: v.optional(v.string()),
  lastModifiedBy: v.optional(v.string()),
  lastModifiedDate: v.optional(v.string()),
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

export type get_GetDraft = v.InferOutput<typeof get_GetDraft>;
export const get_GetDraft = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft/{draftId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      draftId: v.string(),
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_UpdateDraft = v.InferOutput<typeof put_UpdateDraft>;
export const put_UpdateDraft = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft/{draftId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      draftId: v.string(),
    }),
    body: EmailDraftDTO_Simple,
  }),
  response: v.unknown(),
});

export type delete_DeleteDraft = v.InferOutput<typeof delete_DeleteDraft>;
export const delete_DeleteDraft = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft/{draftId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      draftId: v.string(),
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

export type put_UpdateService = v.InferOutput<typeof put_UpdateService>;
export const put_UpdateService = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      serviceId: v.string(),
    }),
    body: UpdateServiceInput,
  }),
  response: v.unknown(),
});

export type delete_DeleteService = v.InferOutput<typeof delete_DeleteService>;
export const delete_DeleteService = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      version: v.number(),
    }),
    path: v.object({
      buyOptionId: v.string(),
      serviceId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_UpdatePackage = v.InferOutput<typeof put_UpdatePackage>;
export const put_UpdatePackage = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      packageId: v.string(),
    }),
    body: UpdatePackageInput,
  }),
  response: v.unknown(),
});

export type delete_DeletePackage = v.InferOutput<typeof delete_DeletePackage>;
export const delete_DeletePackage = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      version: v.number(),
    }),
    path: v.object({
      buyOptionId: v.string(),
      packageId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_UpdateEventDay = v.InferOutput<typeof put_UpdateEventDay>;
export const put_UpdateEventDay = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      eventDayId: v.string(),
    }),
    body: UpdateEventDayInput,
  }),
  response: v.unknown(),
});

export type delete_DeleteEventDay = v.InferOutput<typeof delete_DeleteEventDay>;
export const delete_DeleteEventDay = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      version: v.number(),
    }),
    path: v.object({
      buyOptionId: v.string(),
      eventDayId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_UpdateEventDayOrder = v.InferOutput<typeof put_UpdateEventDayOrder>;
export const put_UpdateEventDayOrder = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}/order"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      eventDayId: v.string(),
    }),
    body: UpdateEventDayOrderInput,
  }),
  response: v.unknown(),
});

export type put_UpdateBenefit = v.InferOutput<typeof put_UpdateBenefit>;
export const put_UpdateBenefit = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      benefitId: v.string(),
    }),
    body: UpdateBenefitInput,
  }),
  response: v.unknown(),
});

export type delete_DeleteBenefit = v.InferOutput<typeof delete_DeleteBenefit>;
export const delete_DeleteBenefit = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      version: v.number(),
    }),
    path: v.object({
      buyOptionId: v.string(),
      benefitId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type put_UpdateAddonPackage = v.InferOutput<typeof put_UpdateAddonPackage>;
export const put_UpdateAddonPackage = v.object({
  method: v.literal("PUT"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/addon-package/{addonPackageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      addonPackageId: v.string(),
    }),
    body: UpdateAddonPackageInput,
  }),
  response: v.unknown(),
});

export type delete_DeleteAddonPackage_1 = v.InferOutput<typeof delete_DeleteAddonPackage_1>;
export const delete_DeleteAddonPackage_1 = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/addon-package/{addonPackageId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      version: v.number(),
    }),
    path: v.object({
      buyOptionId: v.string(),
      addonPackageId: v.string(),
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

export type post_GetLegacyOrganizationsByNotesIds = v.InferOutput<typeof post_GetLegacyOrganizationsByNotesIds>;
export const post_GetLegacyOrganizationsByNotesIds = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/organization/find-by-notes-ids"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: NotesIdRequest_Detailed,
  }),
  response: BulkLegacyOrganizationsOutput_Detailed,
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
        timeoutHandler: v.optional(TimeoutHandler),
        done: v.optional(v.boolean()),
        cancelled: v.optional(v.boolean()),
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
        timeoutHandler: v.optional(TimeoutHandler),
        done: v.optional(v.boolean()),
        cancelled: v.optional(v.boolean()),
      }),
    }),
  }),
  response: v.unknown(),
});

export type post_ExportPortraits = v.InferOutput<typeof post_ExportPortraits>;
export const post_ExportPortraits = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/jobs/export/portraits"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    body: ExportPortraitsEnqueuedRequest,
  }),
  response: ExportPortraitsEnqueuedResponse,
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

export type post_SendTestEmail = v.InferOutput<typeof post_SendTestEmail>;
export const post_SendTestEmail = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/test"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
    body: TestEmailRequestDTO,
  }),
  response: v.unknown(),
});

export type get_GetDrafts = v.InferOutput<typeof get_GetDrafts>;
export const get_GetDrafts = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    query: v.object({
      page: v.number(),
      size: v.number(),
    }),
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: v.unknown(),
});

export type post_CreateDraft = v.InferOutput<typeof post_CreateDraft>;
export const post_CreateDraft = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
    body: EmailDraftDTO_Simple,
  }),
  response: v.unknown(),
});

export type post_SendBulkEmail = v.InferOutput<typeof post_SendBulkEmail>;
export const post_SendBulkEmail = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft/{draftId}/send"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      draftId: v.string(),
    }),
    body: EmailSendRequestDTO,
  }),
  response: SendBulkEmailResponseDTO,
});

export type post_PreviewBulkEmail = v.InferOutput<typeof post_PreviewBulkEmail>;
export const post_PreviewBulkEmail = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/draft/{draftId}/preview"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      draftId: v.string(),
    }),
    body: EmailSendRequestDTO,
  }),
  response: PreviewBulkEmailOutput,
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

export type post_CreateService = v.InferOutput<typeof post_CreateService>;
export const post_CreateService = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/service"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: CreateServiceInput,
  }),
  response: v.unknown(),
});

export type post_MoveService = v.InferOutput<typeof post_MoveService>;
export const post_MoveService = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}/move"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      serviceId: v.string(),
    }),
    body: MoveServiceInput,
  }),
  response: v.unknown(),
});

export type post_CreatePackage = v.InferOutput<typeof post_CreatePackage>;
export const post_CreatePackage = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/package"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: CreatePackageInput,
  }),
  response: v.unknown(),
});

export type post_MovePackage = v.InferOutput<typeof post_MovePackage>;
export const post_MovePackage = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}/move"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
      packageId: v.string(),
    }),
    body: MovePackageInput,
  }),
  response: v.unknown(),
});

export type post_CreateEventDay = v.InferOutput<typeof post_CreateEventDay>;
export const post_CreateEventDay = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/event-day"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: CreateEventDayInput,
  }),
  response: v.unknown(),
});

export type post_CreateBenefit = v.InferOutput<typeof post_CreateBenefit>;
export const post_CreateBenefit = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/benefit"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: CreateBenefitInput,
  }),
  response: v.unknown(),
});

export type post_CreateAddonPackage = v.InferOutput<typeof post_CreateAddonPackage>;
export const post_CreateAddonPackage = v.object({
  method: v.literal("POST"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/addon-package"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: CreateAddonPackageInput,
  }),
  response: v.unknown(),
});

export type patch_UpdateMetadata = v.InferOutput<typeof patch_UpdateMetadata>;
export const patch_UpdateMetadata = v.object({
  method: v.literal("PATCH"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/metadata/change-name"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: ChangeBuyOptionNameInput,
  }),
  response: v.unknown(),
});

export type patch_ChangeAllowedSignUpDays = v.InferOutput<typeof patch_ChangeAllowedSignUpDays>;
export const patch_ChangeAllowedSignUpDays = v.object({
  method: v.literal("PATCH"),
  path: v.literal("/api/v2/admin/buy-option/{buyOptionId}/metadata/change-allowed-signup-days"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      buyOptionId: v.string(),
    }),
    body: ChangeAllowedSignUpDaysInput,
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
      sortBy: v.optional(v.string()),
      sortDirection: v.optional(v.string()),
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
  response: LegacyOrganizationOutput_Detailed,
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
    query: v.object({
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
    }),
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: PagedExportsForEventOutput,
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

export type get_LoadEventById = v.InferOutput<typeof get_LoadEventById>;
export const get_LoadEventById = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
    }),
  }),
  response: DetailedEventResponse,
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

export type get_GetJobStatus = v.InferOutput<typeof get_GetJobStatus>;
export const get_GetJobStatus = v.object({
  method: v.literal("GET"),
  path: v.literal("/api/v2/admin/event/{eventId}/email/job/{jobId}/status"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      jobId: v.string(),
      eventId: v.string(),
    }),
  }),
  response: EmailJobStatusDTO,
});

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

export type delete_DeleteExport = v.InferOutput<typeof delete_DeleteExport>;
export const delete_DeleteExport = v.object({
  method: v.literal("DELETE"),
  path: v.literal("/api/v2/admin/events/{eventId}/exports/{exportId}"),
  requestFormat: v.literal("json"),
  parameters: v.object({
    path: v.object({
      eventId: v.string(),
      exportId: v.string(),
    }),
  }),
  response: v.unknown(),
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
    "/api/v2/admin/event/{eventId}/email/draft/{draftId}": get_GetDraft,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": get_GetAddonPackage,
    "/api/v2/admin/event/{eventId}/email/draft": get_GetDrafts,
    "/api/v2/admin/event/{eventId}/buy-option": get_GetEventBuysOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package": get_GetAllAddonPackages,
    "/api/v2/admin/organization": get_GetAllLegacyOrganizations,
    "/api/v2/admin/organization/{id}": get_GetLegacyOrganization,
    "/api/v2/admin/jobs": get_GetJobs,
    "/api/v2/admin/jobs/{jobId}": get_GetJobDetails,
    "/api/v2/admin/events/{eventId}/exports": get_GetExports,
    "/api/v2/admin/events/{eventId}/exports/{exportId}/download": get_GetDownloadUrl,
    "/api/v2/admin/event": get_LoadAll,
    "/api/v2/admin/event/{eventId}": get_LoadEventById,
    "/api/v2/admin/event/{eventId}/event_registrations": get_LoadEventRegistrationsForEvent,
    "/api/v2/admin/event/{eventId}/email/job/{jobId}/status": get_GetJobStatus,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}": get_GetEventBuyOption,
  },
  put: {
    "/api/v2/admin/event/{eventId}/email/draft/{draftId}": put_UpdateDraft,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": put_EditAddonPackage,
    "/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}": put_UpdateService,
    "/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}": put_UpdatePackage,
    "/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}": put_UpdateEventDay,
    "/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}/order": put_UpdateEventDayOrder,
    "/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}": put_UpdateBenefit,
    "/api/v2/admin/buy-option/{buyOptionId}/addon-package/{addonPackageId}": put_UpdateAddonPackage,
  },
  delete: {
    "/api/v2/admin/event/{eventId}/email/draft/{draftId}": delete_DeleteDraft,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}": delete_DeleteAddonPackage,
    "/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}": delete_DeleteService,
    "/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}": delete_DeletePackage,
    "/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}": delete_DeleteEventDay,
    "/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}": delete_DeleteBenefit,
    "/api/v2/admin/buy-option/{buyOptionId}/addon-package/{addonPackageId}": delete_DeleteAddonPackage_1,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}": delete_DeleteEventBuyOption,
    "/api/v2/admin/events/{eventId}/exports/{exportId}": delete_DeleteExport,
    "/api/v2/admin/event-registration/{eventRegistrationId}": delete_DeleteEventRegistration,
  },
  post: {
    "/api/v2/admin/registration-document/{registrationDocumentId}/review": post_ReviewDocument,
    "/api/v2/admin/organization/find-by-notes-ids": post_GetLegacyOrganizationsByNotesIds,
    "/api/v2/admin/jobs/{jobId}/restart": post_RestartJob,
    "/api/v2/admin/jobs/import/events": post_ImportEvents,
    "/api/v2/admin/jobs/export/portraits": post_ExportPortraits,
    "/api/v2/admin/jobs/export/logos": post_ExportLogos,
    "/api/v2/admin/jobs/export/advertisements": post_ExportAdvertisements,
    "/api/v2/admin/event/{eventId}/publish": post_PublishEvent,
    "/api/v2/admin/event/{eventId}/email/test": post_SendTestEmail,
    "/api/v2/admin/event/{eventId}/email/draft": post_CreateDraft,
    "/api/v2/admin/event/{eventId}/email/draft/{draftId}/send": post_SendBulkEmail,
    "/api/v2/admin/event/{eventId}/email/draft/{draftId}/preview": post_PreviewBulkEmail,
    "/api/v2/admin/event/{eventId}/buy-option": post_CreateEventBuyOption,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package": post_AddAddonPackage,
    "/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/activate": post_ActivateEventBuyOption,
    "/api/v2/admin/event-registration": post_CreateEventRegistration,
    "/api/v2/admin/event-registration/{eventRegistrationId}/reject": post_RejectEventRegistration,
    "/api/v2/admin/event-registration/{eventRegistrationId}/confirm": post_ConfirmEventRegistration,
    "/api/v2/admin/buy-option/{buyOptionId}/service": post_CreateService,
    "/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}/move": post_MoveService,
    "/api/v2/admin/buy-option/{buyOptionId}/package": post_CreatePackage,
    "/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}/move": post_MovePackage,
    "/api/v2/admin/buy-option/{buyOptionId}/event-day": post_CreateEventDay,
    "/api/v2/admin/buy-option/{buyOptionId}/benefit": post_CreateBenefit,
    "/api/v2/admin/buy-option/{buyOptionId}/addon-package": post_CreateAddonPackage,
  },
  patch: {
    "/api/v2/admin/buy-option/{buyOptionId}/metadata/change-name": patch_UpdateMetadata,
    "/api/v2/admin/buy-option/{buyOptionId}/metadata/change-allowed-signup-days": patch_ChangeAllowedSignUpDays,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PutEndpoints = EndpointByMethod["put"];
export type DeleteEndpoints = EndpointByMethod["delete"];
export type PostEndpoints = EndpointByMethod["post"];
export type PatchEndpoints = EndpointByMethod["patch"];
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
  responseHeaders?: Record<string, unknown>;
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
  responseHeaders?: TConfig["responseHeaders"];
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

  // <ApiClient.patch>
  patch<Path extends keyof PatchEndpoints, TEndpoint extends PatchEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<v.InferOutput<TEndpoint>["parameters"]>
  ): Promise<v.InferOutput<TEndpoint>["response"]> {
    return this.fetcher("patch", this.baseUrl + path, params[0]).then((response) =>
      this.parseResponse(response),
    ) as Promise<v.InferOutput<TEndpoint>["response"]>;
  }
  // </ApiClient.patch>

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
