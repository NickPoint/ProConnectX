import { emptySplitApi as api } from "./emptyApi"
export const addTagTypes = [
  "Order",
  "Freelancer",
  "Dispute",
  "Registration",
  "Service",
  "File",
  "Client",
  "Auth",
  "test-controller",
  "Statistics",
] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: build => ({
      submitOrderForReview: build.mutation<
        SubmitOrderForReviewApiResponse,
        SubmitOrderForReviewApiArg
      >({
        query: queryArg => ({
          url: `/orders/${queryArg.orderId}/submit-for-review`,
          method: "PUT",
        }),
        invalidatesTags: ["Order"],
      }),
      disputeOrder: build.mutation<DisputeOrderApiResponse, DisputeOrderApiArg>(
        {
          query: queryArg => ({
            url: `/orders/${queryArg.orderId}/dispute`,
            method: "PUT",
            body: queryArg.body,
          }),
          invalidatesTags: ["Order"],
        },
      ),
      cancelOrder: build.mutation<CancelOrderApiResponse, CancelOrderApiArg>({
        query: queryArg => ({
          url: `/orders/${queryArg.orderId}/cancel`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Order"],
      }),
      approveOrder: build.mutation<ApproveOrderApiResponse, ApproveOrderApiArg>(
        {
          query: queryArg => ({
            url: `/orders/${queryArg.orderId}/approve`,
            method: "PUT",
          }),
          invalidatesTags: ["Order"],
        },
      ),
      acceptOrder: build.mutation<AcceptOrderApiResponse, AcceptOrderApiArg>({
        query: queryArg => ({
          url: `/orders/${queryArg.orderId}/accept`,
          method: "PUT",
          params: {
            deadlineDate: queryArg.deadlineDate,
          },
        }),
        invalidatesTags: ["Order"],
      }),
      updateFreelancer: build.mutation<
        UpdateFreelancerApiResponse,
        UpdateFreelancerApiArg
      >({
        query: queryArg => ({
          url: `/freelancer/profile`,
          method: "PUT",
          body: queryArg.userProfileUpdateDto,
        }),
        invalidatesTags: ["Freelancer"],
      }),
      rejectProposal: build.mutation<
        RejectProposalApiResponse,
        RejectProposalApiArg
      >({
        query: queryArg => ({
          url: `/dispute/${queryArg.disputeId}/reject-proposal`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Dispute"],
      }),
      proposeSolution: build.mutation<
        ProposeSolutionApiResponse,
        ProposeSolutionApiArg
      >({
        query: queryArg => ({
          url: `/dispute/${queryArg.disputeId}/propose`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Dispute"],
      }),
      forceRelease: build.mutation<ForceReleaseApiResponse, ForceReleaseApiArg>(
        {
          query: queryArg => ({
            url: `/dispute/${queryArg.disputeId}/force-release`,
            method: "PUT",
          }),
          invalidatesTags: ["Dispute"],
        },
      ),
      forceRefund: build.mutation<ForceRefundApiResponse, ForceRefundApiArg>({
        query: queryArg => ({
          url: `/dispute/${queryArg.disputeId}/force-refund`,
          method: "PUT",
        }),
        invalidatesTags: ["Dispute"],
      }),
      acceptProposal: build.mutation<
        AcceptProposalApiResponse,
        AcceptProposalApiArg
      >({
        query: queryArg => ({
          url: `/dispute/${queryArg.disputeId}/accept-proposal`,
          method: "PUT",
        }),
        invalidatesTags: ["Dispute"],
      }),
      rejectRegistrationRequest: build.mutation<
        RejectRegistrationRequestApiResponse,
        RejectRegistrationRequestApiArg
      >({
        query: queryArg => ({
          url: `/admin/registration/${queryArg["type"]}/${queryArg.id}/reject`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Registration"],
      }),
      approveRegistrationRequest: build.mutation<
        ApproveRegistrationRequestApiResponse,
        ApproveRegistrationRequestApiArg
      >({
        query: queryArg => ({
          url: `/admin/registration/${queryArg["type"]}/${queryArg.id}/approve`,
          method: "PUT",
        }),
        invalidatesTags: ["Registration"],
      }),
      createService: build.mutation<
        CreateServiceApiResponse,
        CreateServiceApiArg
      >({
        query: queryArg => ({
          url: `/service`,
          method: "POST",
          params: {
            service: queryArg.service,
          },
        }),
        invalidatesTags: ["Service"],
      }),
      getFilteredServices: build.query<
        GetFilteredServicesApiResponse,
        GetFilteredServicesApiArg
      >({
        query: queryArg => ({
          url: `/service/filter`,
          method: "POST",
          body: queryArg.serviceFilter,
          params: {
            page: queryArg.page,
            size: queryArg.size,
          },
        }),
        providesTags: ["Service"],
      }),
      bookService: build.mutation<BookServiceApiResponse, BookServiceApiArg>({
        query: queryArg => ({
          url: `/orders/book/${queryArg.serviceId}`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Order"],
      }),
      getFreelancer: build.query<GetFreelancerApiResponse, GetFreelancerApiArg>(
        {
          query: () => ({ url: `/freelancer` }),
          providesTags: ["Freelancer"],
        },
      ),
      createFreelancer: build.mutation<
        CreateFreelancerApiResponse,
        CreateFreelancerApiArg
      >({
        query: queryArg => ({
          url: `/freelancer`,
          method: "POST",
          params: {
            registrationRequest: queryArg.registrationRequest,
          },
        }),
        invalidatesTags: ["Freelancer"],
      }),
      updateAvatar: build.mutation<UpdateAvatarApiResponse, UpdateAvatarApiArg>(
        {
          query: queryArg => ({
            url: `/files/avatar`,
            method: "POST",
            body: queryArg.body,
          }),
          invalidatesTags: ["File"],
        },
      ),
      getClient: build.query<GetClientApiResponse, GetClientApiArg>({
        query: () => ({ url: `/client` }),
        providesTags: ["Client"],
      }),
      createClient: build.mutation<CreateClientApiResponse, CreateClientApiArg>(
        {
          query: queryArg => ({
            url: `/client`,
            method: "POST",
            params: {
              registrationRequest: queryArg.registrationRequest,
            },
          }),
          invalidatesTags: ["Client"],
        },
      ),
      switchRole: build.mutation<SwitchRoleApiResponse, SwitchRoleApiArg>({
        query: queryArg => ({
          url: `/auth/switch-role`,
          method: "POST",
          params: {
            role: queryArg.role,
          },
        }),
        invalidatesTags: ["Auth"],
      }),
      registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>(
        {
          query: queryArg => ({
            url: `/auth/signup`,
            method: "POST",
            body: queryArg.signupFormRequest,
          }),
          invalidatesTags: ["Auth"],
        },
      ),
      logoutUser: build.mutation<LogoutUserApiResponse, LogoutUserApiArg>({
        query: () => ({ url: `/auth/logout`, method: "POST" }),
        invalidatesTags: ["Auth"],
      }),
      authenticateUser: build.mutation<
        AuthenticateUserApiResponse,
        AuthenticateUserApiArg
      >({
        query: queryArg => ({
          url: `/auth/login`,
          method: "POST",
          body: queryArg.loginRequest,
        }),
        invalidatesTags: ["Auth"],
      }),
      checkEmail: build.mutation<CheckEmailApiResponse, CheckEmailApiArg>({
        query: queryArg => ({
          url: `/auth/check-email`,
          method: "POST",
          params: {
            email: queryArg.email,
          },
        }),
        invalidatesTags: ["Auth"],
      }),
      userAccess: build.query<UserAccessApiResponse, UserAccessApiArg>({
        query: () => ({ url: `/test/user` }),
        providesTags: ["test-controller"],
      }),
      moderatorAccess: build.query<
        ModeratorAccessApiResponse,
        ModeratorAccessApiArg
      >({
        query: () => ({ url: `/test/freelancer` }),
        providesTags: ["test-controller"],
      }),
      allAccess: build.query<AllAccessApiResponse, AllAccessApiArg>({
        query: () => ({ url: `/test/all` }),
        providesTags: ["test-controller"],
      }),
      adminAccess: build.query<AdminAccessApiResponse, AdminAccessApiArg>({
        query: () => ({ url: `/test/admin` }),
        providesTags: ["test-controller"],
      }),
      getStatsOverview: build.query<
        GetStatsOverviewApiResponse,
        GetStatsOverviewApiArg
      >({
        query: queryArg => ({
          url: `/statistics/overview`,
          params: {
            start: queryArg.start,
            end: queryArg.end,
            zoneId: queryArg.zoneId,
          },
        }),
        providesTags: ["Statistics"],
      }),
      getService: build.query<GetServiceApiResponse, GetServiceApiArg>({
        query: queryArg => ({ url: `/service/${queryArg.id}` }),
        providesTags: ["Service"],
      }),
      getOrders: build.query<GetOrdersApiResponse, GetOrdersApiArg>({
        query: queryArg => ({
          url: `/orders`,
          params: {
            page: queryArg.page,
            size: queryArg.size,
          },
        }),
        providesTags: ["Order"],
      }),
      getOrder: build.query<GetOrderApiResponse, GetOrderApiArg>({
        query: queryArg => ({ url: `/orders/${queryArg.orderId}` }),
        providesTags: ["Order"],
      }),
      getActiveOrders: build.query<
        GetActiveOrdersApiResponse,
        GetActiveOrdersApiArg
      >({
        query: queryArg => ({
          url: `/orders/active`,
          params: {
            page: queryArg.page,
            size: queryArg.size,
          },
        }),
        providesTags: ["Order"],
      }),
      getFile: build.query<GetFileApiResponse, GetFileApiArg>({
        query: queryArg => ({ url: `/files/${queryArg.fileId}` }),
        providesTags: ["File"],
      }),
      getDispute: build.query<GetDisputeApiResponse, GetDisputeApiArg>({
        query: queryArg => ({ url: `/dispute/${queryArg.disputeId}` }),
        providesTags: ["Dispute"],
      }),
      getCurrentUser: build.query<
        GetCurrentUserApiResponse,
        GetCurrentUserApiArg
      >({
        query: () => ({ url: `/auth` }),
        providesTags: ["Auth"],
      }),
      getFreelancerRegistrationRequests: build.query<
        GetFreelancerRegistrationRequestsApiResponse,
        GetFreelancerRegistrationRequestsApiArg
      >({
        query: () => ({ url: `/auth/freelancer-registrations` }),
        providesTags: ["Auth"],
      }),
      getClientRegistrationRequests: build.query<
        GetClientRegistrationRequestsApiResponse,
        GetClientRegistrationRequestsApiArg
      >({
        query: () => ({ url: `/auth/client-registrations` }),
        providesTags: ["Auth"],
      }),
      getFreelancersRegistrationRequests: build.query<
        GetFreelancersRegistrationRequestsApiResponse,
        GetFreelancersRegistrationRequestsApiArg
      >({
        query: () => ({ url: `/admin/freelancer-registrations` }),
        providesTags: ["Registration"],
      }),
      getClientsRegistrationRequests: build.query<
        GetClientsRegistrationRequestsApiResponse,
        GetClientsRegistrationRequestsApiArg
      >({
        query: () => ({ url: `/admin/client-registrations` }),
        providesTags: ["Registration"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as pcxApi }
export type SubmitOrderForReviewApiResponse = unknown
export type SubmitOrderForReviewApiArg = {
  orderId: number
}
export type DisputeOrderApiResponse = unknown
export type DisputeOrderApiArg = {
  orderId: number
  body: string
}
export type CancelOrderApiResponse = unknown
export type CancelOrderApiArg = {
  orderId: number
  body: string
}
export type ApproveOrderApiResponse = unknown
export type ApproveOrderApiArg = {
  orderId: number
}
export type AcceptOrderApiResponse = unknown
export type AcceptOrderApiArg = {
  orderId: number
  deadlineDate: string
}
export type UpdateFreelancerApiResponse = unknown
export type UpdateFreelancerApiArg = {
  userProfileUpdateDto: UserProfileUpdateDto
}
export type RejectProposalApiResponse = unknown
export type RejectProposalApiArg = {
  disputeId: number
  body: string
}
export type ProposeSolutionApiResponse = unknown
export type ProposeSolutionApiArg = {
  disputeId: number
  body: string
}
export type ForceReleaseApiResponse = unknown
export type ForceReleaseApiArg = {
  disputeId: number
}
export type ForceRefundApiResponse = unknown
export type ForceRefundApiArg = {
  disputeId: number
}
export type AcceptProposalApiResponse = unknown
export type AcceptProposalApiArg = {
  disputeId: number
}
export type RejectRegistrationRequestApiResponse = /** status 200 OK */ object
export type RejectRegistrationRequestApiArg = {
  id: number
  type: "ADMIN" | "CLIENT" | "FREELANCER"
  body: string
}
export type ApproveRegistrationRequestApiResponse = /** status 200 OK */ object
export type ApproveRegistrationRequestApiArg = {
  id: number
  type: "ADMIN" | "CLIENT" | "FREELANCER"
}
export type CreateServiceApiResponse = /** status 201 Created */ number
export type CreateServiceApiArg = {
  service: ServiceCreateDto
}
export type GetFilteredServicesApiResponse =
  /** status 200 OK */ PageLightweightServiceDto
export type GetFilteredServicesApiArg = {
  page?: number
  size?: number
  serviceFilter: ServiceFilter
}
export type BookServiceApiResponse = /** status 200 OK */ number
export type BookServiceApiArg = {
  serviceId: number
  body: string
}
export type GetFreelancerApiResponse = /** status 200 OK */ FreelancerDto
export type GetFreelancerApiArg = void
export type CreateFreelancerApiResponse =
  /** status 201 Created */ FreelancerDto
export type CreateFreelancerApiArg = {
  registrationRequest: FreelancerRegistrationRequest
}
export type UpdateAvatarApiResponse = /** status 200 OK */ object
export type UpdateAvatarApiArg = {
  body: {
    avatar: Blob
  }
}
export type GetClientApiResponse = /** status 200 OK */ ClientDto
export type GetClientApiArg = void
export type CreateClientApiResponse = /** status 201 Created */ ClientDto
export type CreateClientApiArg = {
  registrationRequest: ClientRegistrationRequest
}
export type SwitchRoleApiResponse = /** status 200 OK */ object
export type SwitchRoleApiArg = {
  role: RoleType
}
export type RegisterUserApiResponse = /** status 200 OK */ AuthResponse
export type RegisterUserApiArg = {
  signupFormRequest: SignupFormRequest
}
export type LogoutUserApiResponse = /** status 200 OK */ object
export type LogoutUserApiArg = void
export type AuthenticateUserApiResponse = /** status 200 OK */ AuthResponse
export type AuthenticateUserApiArg = {
  loginRequest: LoginRequest
}
export type CheckEmailApiResponse = unknown
export type CheckEmailApiArg = {
  email: string
}
export type UserAccessApiResponse = /** status 200 OK */ string
export type UserAccessApiArg = void
export type ModeratorAccessApiResponse = /** status 200 OK */ string
export type ModeratorAccessApiArg = void
export type AllAccessApiResponse = /** status 200 OK */ string
export type AllAccessApiArg = void
export type AdminAccessApiResponse = /** status 200 OK */ string
export type AdminAccessApiArg = void
export type GetStatsOverviewApiResponse = /** status 200 OK */ {
  [key: string]: StatisticsDto
}
export type GetStatsOverviewApiArg = {
  start: string
  end: string
  zoneId: string
}
export type GetServiceApiResponse = /** status 200 OK */ ServiceDto
export type GetServiceApiArg = {
  id: number
}
export type GetOrdersApiResponse = /** status 200 OK */ PageOrderDto
export type GetOrdersApiArg = {
  page?: number
  size?: number
}
export type GetOrderApiResponse = /** status 200 OK */ OrderDto
export type GetOrderApiArg = {
  orderId: number
}
export type GetActiveOrdersApiResponse = /** status 200 OK */ PageOrderDto
export type GetActiveOrdersApiArg = {
  page?: number
  size?: number
}
export type GetFileApiResponse = /** status 200 OK */ Blob
export type GetFileApiArg = {
  fileId: number
}
export type GetDisputeApiResponse = /** status 200 OK */ DisputeDto
export type GetDisputeApiArg = {
  disputeId: number
}
export type GetCurrentUserApiResponse = /** status 200 OK */ AuthResponse
export type GetCurrentUserApiArg = void
export type GetFreelancerRegistrationRequestsApiResponse =
  /** status 200 OK */ LightweightRegistrationRequestDto[]
export type GetFreelancerRegistrationRequestsApiArg = void
export type GetClientRegistrationRequestsApiResponse =
  /** status 200 OK */ LightweightRegistrationRequestDto[]
export type GetClientRegistrationRequestsApiArg = void
export type GetFreelancersRegistrationRequestsApiResponse =
  /** status 200 OK */ RegistrationRequestDto[]
export type GetFreelancersRegistrationRequestsApiArg = void
export type GetClientsRegistrationRequestsApiResponse =
  /** status 200 OK */ RegistrationRequestDto[]
export type GetClientsRegistrationRequestsApiArg = void
export type ErrorMessage = {
  id?: string
  message?: string
}
export type AddressDto = {
  street: string
  city: string
  region: string
  postalCode: string
  country: string
  houseNumber: string
}
export type UserProfileUpdateDto = {
  firstName: string
  lastName: string
  address: AddressDto
  phoneNumber: string
}
export type ServiceAddressDto = {
  street?: string
  city: string
  region: string
  postalCode?: string
  country: string
  houseNumber?: string
}
export type ServiceCreateDto = {
  title: string
  description: string
  shortDescription: string
  price: number
  address?: ServiceAddressDto
  categories: CategoryType[]
  images: Blob[]
  workflowJson?: string
  faqsJson?: string
}
export type SortObject = {
  direction?: string
  nullHandling?: string
  ascending?: boolean
  property?: string
  ignoreCase?: boolean
}
export type PageableObject = {
  paged?: boolean
  unpaged?: boolean
  pageNumber?: number
  pageSize?: number
  offset?: number
  sort?: SortObject[]
}
export type LightweightAddressDto = {
  city: string
  postalCode: string
  country: string
}
export type LightWeightFreelancerDto = {
  id: number
  firstName: string
  lastName: string
  rating: number
  email: string
  phoneNumber: string
  avatarImageUrl?: string
}
export type LightweightServiceDto = {
  id: number
  title: string
  shortDescription: string
  address?: LightweightAddressDto
  rating: number
  ratingCount: number
  price: number
  freelancer: LightWeightFreelancerDto
  categories: CategoryType[]
  postedAt: string
  thumbnailUrl: string
}
export type PageLightweightServiceDto = {
  totalPages?: number
  totalElements?: number
  numberOfElements?: number
  pageable?: PageableObject
  first?: boolean
  last?: boolean
  size?: number
  content?: LightweightServiceDto[]
  number?: number
  sort?: SortObject[]
  empty?: boolean
}
export type ServiceFilter = {
  title?: string
  categories: CategoryType[]
  location?: string
  rating: number
  minBudget: number
  maxBudget: number
}
export type FreelancerDto = {
  id: number
  address: AddressDto
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  rating: number
  ratingCount: number
  avatarImageUrl?: string
}
export type FreelancerRegistrationRequest = {
  firstName: string
  lastName: string
  address: AddressDto
  phoneNumber: string
  categories: CategoryType[]
  avatarImage?: Blob
  description: string
  idDocument: Blob[]
}
export type ClientDto = {
  id: number
  address: AddressDto
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  rating: number
  ratingCount: number
  avatarImageUrl?: string
}
export type ClientRegistrationRequest = {
  firstName: string
  lastName: string
  address: AddressDto
  phoneNumber: string
  avatarImage?: Blob
  idDocument: Blob[]
}
export type Account = {
  userId?: number
  accountStatus?: AccountStatus
  accountType?: AccountType
}
export type AuthResponse = {
  firstName?: string
  lastName?: string
  email: string
  accounts: Account[]
  roles: RoleType[]
  activeRole: RoleType
  avatarImageUrl?: string
}
export type SignupFormRequest = {
  email: string
  password: string
  role: RoleType
}
export type LoginRequest = {
  email: string
  password: string
}
export type StatisticsDto = {
  value: number
  trend?: string
  percentGrow?: number
  data?: number[]
}
export type WorkflowStep = {
  stepNumber: number
  title: string
  description?: string
}
export type Faq = {
  question: string
  answer: string
}
export type ReviewerDto = {
  id: number
  firstName: string
  lastName?: string
  rating: number
  type: Type
  avatarImageUrl?: string
}
export type ReviewDto = {
  id: number
  reviewer: ReviewerDto
  body?: string
  rating: number
  createdAt: string
}
export type ServiceDto = {
  id: number
  freelancer: LightWeightFreelancerDto
  title: string
  description: string
  shortDescription: string
  price: number
  workflow?: WorkflowStep[]
  faqs?: Faq[]
  address?: ServiceAddressDto
  reviews?: ReviewDto[]
  categories: CategoryType[]
  rating: number
  ratingCount: number
  galleryUrls: string[]
  postedAt: string
}
export type LightweightClientDto = {
  id: number
  firstName: string
  lastName: string
  rating: number
  ratingCount: number
  email: string
  phoneNumber: string
  avatarImageUrl?: string
}
export type LightweightTransactionDto = {
  id: number
  status: TransactionStatus
}
export type EventDto = {
  id: number
  type: EventType
  createdAt: string
  disputeId?: number
}
export type OrderDto = {
  id: number
  service: LightweightServiceDto
  client: LightweightClientDto
  status: OrderStatus
  transaction: LightweightTransactionDto
  events: EventDto[]
  additionalNotes?: string
  rejectionReason?: string
  createdAt: string
  deadlineDate?: string
  updatedAt?: string
}
export type PageOrderDto = {
  totalPages?: number
  totalElements?: number
  numberOfElements?: number
  pageable?: PageableObject
  first?: boolean
  last?: boolean
  size?: number
  content?: OrderDto[]
  number?: number
  sort?: SortObject[]
  empty?: boolean
}
export type DisputeDto = {
  id: number
  status: DisputeStatus
  reason: string
  proposalStatus?: ProposalStatus
  proposal?: string
  proposalRejectionReason?: string
}
export type LightweightRegistrationRequestDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  accountStatus: AccountStatus
  rejectionReason?: string
  registrationDate: string
  accountType: AccountType
}
export type RegistrationRequestDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  avatarImageUrl?: string
  phoneNumber: string
  accountStatus: AccountStatus
  rejectionReason?: string
  registrationDate: string
  accountType: AccountType
}
export enum CategoryType {
  WebDesign = "WEB_DESIGN",
  WebDevelopment = "WEB_DEVELOPMENT",
  FrontendDevelopment = "FRONTEND_DEVELOPMENT",
  BackendDevelopment = "BACKEND_DEVELOPMENT",
  MobileAppDevelopment = "MOBILE_APP_DEVELOPMENT",
  GameDevelopment = "GAME_DEVELOPMENT",
  WordpressDevelopment = "WORDPRESS_DEVELOPMENT",
  EcommerceDevelopment = "ECOMMERCE_DEVELOPMENT",
  SoftwareDevelopment = "SOFTWARE_DEVELOPMENT",
  ApiDevelopment = "API_DEVELOPMENT",
  GraphicDesign = "GRAPHIC_DESIGN",
  UiUxDesign = "UI_UX_DESIGN",
  LogoDesign = "LOGO_DESIGN",
  BrandIdentityDesign = "BRAND_IDENTITY_DESIGN",
  VideoEditing = "VIDEO_EDITING",
  Animation = "ANIMATION",
  Illistration = "ILLISTRATION",
  ThreeDModeling = "THREE_D_MODELING",
  PresentationDesign = "PRESENTATION_DESIGN",
  InteriorDesign = "INTERIOR_DESIGN",
  ContentWriting = "CONTENT_WRITING",
  Copywriting = "COPYWRITING",
  Ghostwriting = "GHOSTWRITING",
  TechnicalWriting = "TECHNICAL_WRITING",
  ResumeWriting = "RESUME_WRITING",
  GrantWriting = "GRANT_WRITING",
  CreativeWriting = "CREATIVE_WRITING",
  SeoWriting = "SEO_WRITING",
  Scriptwriting = "SCRIPTWRITING",
  EditingProofreading = "EDITING_PROOFREADING",
  Translation = "TRANSLATION",
  Transcription = "TRANSCRIPTION",
  LanguageTutoring = "LANGUAGE_TUTORING",
  SubtitlingCaptioning = "SUBTITLING_CAPTIONING",
  LocalizationServices = "LOCALIZATION_SERVICES",
  DigitalMarketing = "DIGITAL_MARKETING",
  SocialMediaMarketing = "SOCIAL_MEDIA_MARKETING",
  SeoSem = "SEO_SEM",
  EmailMarketing = "EMAIL_MARKETING",
  AffiliateMarketing = "AFFILIATE_MARKETING",
  InfluencerMarketing = "INFLUENCER_MARKETING",
  LeadGeneration = "LEAD_GENERATION",
  Telemarketing = "TELEMARKETING",
  BrandStrategy = "BRAND_STRATEGY",
  CustomerSupport = "CUSTOMER_SUPPORT",
  TechnicalSupport = "TECHNICAL_SUPPORT",
  VirtualAssistant = "VIRTUAL_ASSISTANT",
  ChatSupport = "CHAT_SUPPORT",
  HelpdeskServices = "HELPDESK_SERVICES",
  DataEntry = "DATA_ENTRY",
  WebResearch = "WEB_RESEARCH",
  ProjectManagement = "PROJECT_MANAGEMENT",
  CalendarManagement = "CALENDAR_MANAGEMENT",
  DocumentPreparation = "DOCUMENT_PREPARATION",
  DataAnalysis = "DATA_ANALYSIS",
  DataEngineering = "DATA_ENGINEERING",
  MachineLearning = "MACHINE_LEARNING",
  AiDevelopment = "AI_DEVELOPMENT",
  BusinessIntelligence = "BUSINESS_INTELLIGENCE",
  DataVisualization = "DATA_VISUALIZATION",
  BigDataServices = "BIG_DATA_SERVICES",
  CivilEngineering = "CIVIL_ENGINEERING",
  MechanicalEngineering = "MECHANICAL_ENGINEERING",
  ElectricalEngineering = "ELECTRICAL_ENGINEERING",
  StructuralEngineering = "STRUCTURAL_ENGINEERING",
  CadDrafting = "CAD_DRAFTING",
  ArchitectureDesign = "ARCHITECTURE_DESIGN",
  ProductDesign = "PRODUCT_DESIGN",
  Accounting = "ACCOUNTING",
  Bookkeeping = "BOOKKEEPING",
  FinancialAnalysis = "FINANCIAL_ANALYSIS",
  BusinessConsulting = "BUSINESS_CONSULTING",
  TaxPreparation = "TAX_PREPARATION",
  HrConsulting = "HR_CONSULTING",
  FinancialModeling = "FINANCIAL_MODELING",
  LegalConsulting = "LEGAL_CONSULTING",
  ContractDrafting = "CONTRACT_DRAFTING",
  IntellectualProperty = "INTELLECTUAL_PROPERTY",
  CorporateLaw = "CORPORATE_LAW",
  FamilyLawServices = "FAMILY_LAW_SERVICES",
  CoachingMentoring = "COACHING_MENTORING",
  FitnessTraining = "FITNESS_TRAINING",
  MusicProduction = "MUSIC_PRODUCTION",
  PodcastEditing = "PODCAST_EDITING",
  CareerCounseling = "CAREER_COUNSELING",
  EventPlanning = "EVENT_PLANNING",
  LifeCoaching = "LIFE_COACHING",
  PlumbingServices = "PLUMBING_SERVICES",
  ElectricalRepair = "ELECTRICAL_REPAIR",
  CarpentryServices = "CARPENTRY_SERVICES",
  AutoRepair = "AUTO_REPAIR",
  HouseCleaning = "HOUSE_CLEANING",
  MovingHelp = "MOVING_HELP",
  GardeningLandscaping = "GARDENING_LANDSCAPING",
  ConstructionWork = "CONSTRUCTION_WORK",
  PestControl = "PEST_CONTROL",
  LocksmithServices = "LOCKSMITH_SERVICES",
  PaintingServices = "PAINTING_SERVICES",
  HvacRepair = "HVAC_REPAIR",
  ApplianceRepair = "APPLIANCE_REPAIR",
  FurnitureAssembly = "FURNITURE_ASSEMBLY",
  PetSitting = "PET_SITTING",
  DogWalking = "DOG_WALKING",
  Babysitting = "BABYSITTING",
  ElderlyCare = "ELDERLY_CARE",
  SecurityServices = "SECURITY_SERVICES",
  WindowCleaning = "WINDOW_CLEANING",
  WasteRemoval = "WASTE_REMOVAL",
  RecyclingServices = "RECYCLING_SERVICES",
  CarWashing = "CAR_WASHING",
  CarScraping = "CAR_SCRAPING",
  BikeRepair = "BIKE_REPAIR",
  FlooringInstallation = "FLOORING_INSTALLATION",
  RoofingServices = "ROOFING_SERVICES",
  WaterDamageRestoration = "WATER_DAMAGE_RESTORATION",
  PoolCleaning = "POOL_CLEANING",
  SnowRemoval = "SNOW_REMOVAL",
  EventStaffing = "EVENT_STAFFING",
  CateringServices = "CATERING_SERVICES",
  PhotographyServices = "PHOTOGRAPHY_SERVICES",
  MakeupArtist = "MAKEUP_ARTIST",
  TattooArtist = "TATTOO_ARTIST",
  Other = "OTHER",
}
export enum RoleType {
  RoleEmployer = "ROLE_EMPLOYER",
  RoleFreelancer = "ROLE_FREELANCER",
  RoleAdmin = "ROLE_ADMIN",
  RoleUnverified = "ROLE_UNVERIFIED",
  RoleClient = "ROLE_CLIENT",
}
export enum AccountStatus {
  Unverified = "UNVERIFIED",
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Deleted = "DELETED",
  Banned = "BANNED",
  Rejected = "REJECTED",
}
export enum AccountType {
  Admin = "ADMIN",
  Client = "CLIENT",
  Freelancer = "FREELANCER",
}
export enum Type {
  Employer = "Employer",
  Client = "Client",
  Freelancer = "Freelancer",
}
export enum OrderStatus {
  Created = "CREATED",
  InProgress = "IN_PROGRESS",
  SubmittedForReview = "SUBMITTED_FOR_REVIEW",
  Approved = "APPROVED",
  Completed = "COMPLETED",
  Disputed = "DISPUTED",
  Canceled = "CANCELED",
}
export enum TransactionStatus {
  Pending = "PENDING",
  Escrowed = "ESCROWED",
  Released = "RELEASED",
  Canceled = "CANCELED",
  Refunded = "REFUNDED",
  Disputed = "DISPUTED",
}
export enum EventType {
  AccountCreated = "ACCOUNT_CREATED",
  VerificationSubmitted = "VERIFICATION_SUBMITTED",
  AccountApproved = "ACCOUNT_APPROVED",
  AccountRejected = "ACCOUNT_REJECTED",
  OrderCreated = "ORDER_CREATED",
  OrderAccepted = "ORDER_ACCEPTED",
  OrderRejected = "ORDER_REJECTED",
  OrderSubmittedForReview = "ORDER_SUBMITTED_FOR_REVIEW",
  OrderApproved = "ORDER_APPROVED",
  OrderCompleted = "ORDER_COMPLETED",
  OrderApprovedByAdmin = "ORDER_APPROVED_BY_ADMIN",
  OrderDisputed = "ORDER_DISPUTED",
  OrderCanceled = "ORDER_CANCELED",
  OrderCanceledWithRefundByAdmin = "ORDER_CANCELED_WITH_REFUND_BY_ADMIN",
  DisputeCreated = "DISPUTE_CREATED",
  DisputeResolved = "DISPUTE_RESOLVED",
  DisputeRejected = "DISPUTE_REJECTED",
  ProposalCreated = "PROPOSAL_CREATED",
  ProposalAccepted = "PROPOSAL_ACCEPTED",
  ProposalRejected = "PROPOSAL_REJECTED",
  TransactionCreated = "TRANSACTION_CREATED",
  TransactionEscrowed = "TRANSACTION_ESCROWED",
  TransactionReleased = "TRANSACTION_RELEASED",
  ReviewSubmitted = "REVIEW_SUBMITTED",
  FileUploaded = "FILE_UPLOADED",
  RoleSwitched = "ROLE_SWITCHED",
}
export enum DisputeStatus {
  Open = "OPEN",
  InReview = "IN_REVIEW",
  ResolvedRefunded = "RESOLVED_REFUNDED",
  ResolvedFreelancerPaid = "RESOLVED_FREELANCER_PAID",
  Rejected = "REJECTED",
}
export enum ProposalStatus {
  None = "NONE",
  Pending = "PENDING",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}
export const {
  useSubmitOrderForReviewMutation,
  useDisputeOrderMutation,
  useCancelOrderMutation,
  useApproveOrderMutation,
  useAcceptOrderMutation,
  useUpdateFreelancerMutation,
  useRejectProposalMutation,
  useProposeSolutionMutation,
  useForceReleaseMutation,
  useForceRefundMutation,
  useAcceptProposalMutation,
  useRejectRegistrationRequestMutation,
  useApproveRegistrationRequestMutation,
  useCreateServiceMutation,
  useGetFilteredServicesQuery,
  useBookServiceMutation,
  useGetFreelancerQuery,
  useCreateFreelancerMutation,
  useUpdateAvatarMutation,
  useGetClientQuery,
  useCreateClientMutation,
  useSwitchRoleMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useAuthenticateUserMutation,
  useCheckEmailMutation,
  useUserAccessQuery,
  useModeratorAccessQuery,
  useAllAccessQuery,
  useAdminAccessQuery,
  useGetStatsOverviewQuery,
  useGetServiceQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetActiveOrdersQuery,
  useGetFileQuery,
  useGetDisputeQuery,
  useGetCurrentUserQuery,
  useGetFreelancerRegistrationRequestsQuery,
  useGetClientRegistrationRequestsQuery,
  useGetFreelancersRegistrationRequestsQuery,
  useGetClientsRegistrationRequestsQuery,
} = injectedRtkApi
