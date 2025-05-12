import { emptySplitApi as api } from "./emptyApi"
export const addTagTypes = [
  "Order",
  "Freelancer",
  "Dispute",
  "Client",
  "Registration",
  "Service",
  "Review",
  "Auth",
  "test-controller",
  "Statistics",
  "File",
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
      notifyAdmin: build.mutation<NotifyAdminApiResponse, NotifyAdminApiArg>({
        query: queryArg => ({
          url: `/dispute/${queryArg.disputeId}/notify-admin`,
          method: "PUT",
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
      updateClient: build.mutation<UpdateClientApiResponse, UpdateClientApiArg>(
        {
          query: queryArg => ({
            url: `/client/update`,
            method: "PUT",
            body: queryArg.userProfileUpdateDto,
          }),
          invalidatesTags: ["Client"],
        },
      ),
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
      getServices: build.query<GetServicesApiResponse, GetServicesApiArg>({
        query: queryArg => ({
          url: `/service`,
          params: {
            title: queryArg.title,
            categories: queryArg.categories,
            location: queryArg.location,
            rating: queryArg.rating,
            minBudget: queryArg.minBudget,
            maxBudget: queryArg.maxBudget,
            page: queryArg.page,
            size: queryArg.size,
            sort: queryArg.sort,
          },
        }),
        providesTags: ["Service"],
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
      postServiceReview: build.mutation<
        PostServiceReviewApiResponse,
        PostServiceReviewApiArg
      >({
        query: queryArg => ({
          url: `/review/${queryArg.orderId}/service`,
          method: "POST",
          body: queryArg.postReviewDto,
        }),
        invalidatesTags: ["Review"],
      }),
      postClientReview: build.mutation<
        PostClientReviewApiResponse,
        PostClientReviewApiArg
      >({
        query: queryArg => ({
          url: `/review/${queryArg.orderId}/client`,
          method: "POST",
          body: queryArg.postReviewDto,
        }),
        invalidatesTags: ["Review"],
      }),
      bookService: build.mutation<BookServiceApiResponse, BookServiceApiArg>({
        query: queryArg => ({
          url: `/orders/book/${queryArg.serviceId}`,
          method: "POST",
          body: queryArg.bookServiceDto,
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
      updateFreelancerAvatar: build.mutation<
        UpdateFreelancerAvatarApiResponse,
        UpdateFreelancerAvatarApiArg
      >({
        query: queryArg => ({
          url: `/freelancer/avatar`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Freelancer"],
      }),
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
      updateClientAvatar: build.mutation<
        UpdateClientAvatarApiResponse,
        UpdateClientAvatarApiArg
      >({
        query: queryArg => ({
          url: `/client/avatar`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Client"],
      }),
      switchProfile: build.mutation<
        SwitchProfileApiResponse,
        SwitchProfileApiArg
      >({
        query: queryArg => ({
          url: `/auth/switch-profile`,
          method: "POST",
          params: {
            newProfileType: queryArg.newProfileType,
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
      logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
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
      addProfile: build.mutation<AddProfileApiResponse, AddProfileApiArg>({
        query: queryArg => ({
          url: `/auth/add-profile`,
          method: "POST",
          params: {
            profileType: queryArg.profileType,
          },
        }),
        invalidatesTags: ["Auth"],
      }),
      checkEmail: build.mutation<CheckEmailApiResponse, CheckEmailApiArg>({
        query: queryArg => ({
          url: `/auth/check-email`,
          method: "HEAD",
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
      getUserServices: build.query<
        GetUserServicesApiResponse,
        GetUserServicesApiArg
      >({
        query: queryArg => ({
          url: `/service/user-services`,
          params: {
            page: queryArg.page,
            size: queryArg.size,
            sort: queryArg.sort,
          },
        }),
        providesTags: ["Service"],
      }),
      getServiceReviews: build.query<
        GetServiceReviewsApiResponse,
        GetServiceReviewsApiArg
      >({
        query: queryArg => ({
          url: `/review/service/${queryArg.serviceId}`,
          params: {
            page: queryArg.page,
            size: queryArg.size,
            sort: queryArg.sort,
          },
        }),
        providesTags: ["Review"],
      }),
      getClientReviews: build.query<
        GetClientReviewsApiResponse,
        GetClientReviewsApiArg
      >({
        query: queryArg => ({
          url: `/review/client/${queryArg.clientId}`,
          params: {
            page: queryArg.page,
            size: queryArg.size,
            sort: queryArg.sort,
          },
        }),
        providesTags: ["Review"],
      }),
      getOrders: build.query<GetOrdersApiResponse, GetOrdersApiArg>({
        query: queryArg => ({
          url: `/orders`,
          params: {
            statuses: queryArg.statuses,
            page: queryArg.page,
            size: queryArg.size,
            sort: queryArg.sort,
          },
        }),
        providesTags: ["Order"],
      }),
      getOrder: build.query<GetOrderApiResponse, GetOrderApiArg>({
        query: queryArg => ({ url: `/orders/${queryArg.orderId}` }),
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
      getRegistrationRequests: build.query<
        GetRegistrationRequestsApiResponse,
        GetRegistrationRequestsApiArg
      >({
        query: () => ({ url: `/auth/registration-requests` }),
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
export type NotifyAdminApiResponse = unknown
export type NotifyAdminApiArg = {
  disputeId: number
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
export type UpdateClientApiResponse = unknown
export type UpdateClientApiArg = {
  userProfileUpdateDto: UserProfileUpdateDto
}
export type RejectRegistrationRequestApiResponse = /** status 200 OK */ object
export type RejectRegistrationRequestApiArg = {
  id: number
  type: ProfileType
  body: string
}
export type ApproveRegistrationRequestApiResponse = /** status 200 OK */ object
export type ApproveRegistrationRequestApiArg = {
  id: number
  type: ProfileType
}
export type GetServicesApiResponse =
  /** status 200 OK */ PageLightweightServiceDto
export type GetServicesApiArg = {
  title?: string
  categories?: CategoryType[]
  location?: string
  rating?: number
  minBudget?: number
  maxBudget?: number
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type CreateServiceApiResponse = /** status 201 Created */ number
export type CreateServiceApiArg = {
  service: ServiceCreateDto
}
export type PostServiceReviewApiResponse = unknown
export type PostServiceReviewApiArg = {
  orderId: number
  postReviewDto: PostReviewDto
}
export type PostClientReviewApiResponse = unknown
export type PostClientReviewApiArg = {
  orderId: number
  postReviewDto: PostReviewDto
}
export type BookServiceApiResponse = /** status 200 OK */ number
export type BookServiceApiArg = {
  serviceId: number
  bookServiceDto: BookServiceDto
}
export type GetFreelancerApiResponse = /** status 200 OK */ FreelancerProfileDto
export type GetFreelancerApiArg = void
export type CreateFreelancerApiResponse =
  /** status 201 Created */ FreelancerProfileDto
export type CreateFreelancerApiArg = {
  registrationRequest: FreelancerRegistrationRequest
}
export type UpdateFreelancerAvatarApiResponse = /** status 200 OK */ object
export type UpdateFreelancerAvatarApiArg = {
  body: {
    avatar: Blob
  }
}
export type GetClientApiResponse = /** status 200 OK */ ClientProfileDto
export type GetClientApiArg = void
export type CreateClientApiResponse = /** status 201 Created */ ClientProfileDto
export type CreateClientApiArg = {
  registrationRequest: ClientRegistrationRequest
}
export type UpdateClientAvatarApiResponse = /** status 200 OK */ object
export type UpdateClientAvatarApiArg = {
  body: {
    avatar: Blob
  }
}
export type SwitchProfileApiResponse = /** status 200 OK */ AuthResponse
export type SwitchProfileApiArg = {
  newProfileType: ProfileType
}
export type RegisterUserApiResponse = /** status 200 OK */ AuthResponse
export type RegisterUserApiArg = {
  signupFormRequest: SignupFormRequest
}
export type LogoutApiResponse = unknown
export type LogoutApiArg = void
export type AuthenticateUserApiResponse = /** status 200 OK */ AuthResponse
export type AuthenticateUserApiArg = {
  loginRequest: LoginRequest
}
export type AddProfileApiResponse = unknown
export type AddProfileApiArg = {
  profileType: ProfileType
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
export type GetUserServicesApiResponse =
  /** status 200 OK */ PageLightweightServiceDto
export type GetUserServicesApiArg = {
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type GetServiceReviewsApiResponse = /** status 200 OK */ PageReviewDto
export type GetServiceReviewsApiArg = {
  serviceId: number
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type GetClientReviewsApiResponse = /** status 200 OK */ PageReviewDto
export type GetClientReviewsApiArg = {
  clientId: number
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type GetOrdersApiResponse = /** status 200 OK */ PageOrderDto
export type GetOrdersApiArg = {
  statuses?: OrderStatus[]
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type GetOrderApiResponse = /** status 200 OK */ OrderDto
export type GetOrderApiArg = {
  orderId: number
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
export type GetRegistrationRequestsApiResponse =
  /** status 200 OK */ RegistrationRequestDto[]
export type GetRegistrationRequestsApiArg = void
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
export type SortObject = {
  direction?: string
  nullHandling?: string
  ascending?: boolean
  property?: string
  ignoreCase?: boolean
}
export type PageableObject = {
  pageNumber?: number
  pageSize?: number
  paged?: boolean
  unpaged?: boolean
  offset?: number
  sort?: SortObject[]
}
export type LightweightAddressDto = {
  city: string
  postalCode: string
  country: string
}
export type BaseProfileDto = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  rating: number
  ratingCount: number
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
  freelancer: BaseProfileDto
  categories: CategoryType[]
  postedAt: string
  thumbnailUrl: string
}
export type PageLightweightServiceDto = {
  totalPages?: number
  totalElements?: number
  pageable?: PageableObject
  first?: boolean
  last?: boolean
  size?: number
  content?: LightweightServiceDto[]
  number?: number
  sort?: SortObject[]
  numberOfElements?: number
  empty?: boolean
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
export type PostReviewDto = {
  rating: number
  body?: string
}
export type BookServiceDto = {
  additionalNotes?: string
  /** List of files to upload */
  files?: Blob[]
}
export type FreelancerProfileDto = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  rating: number
  ratingCount: number
  avatarImageUrl?: string
  address: AddressDto
}
export type FreelancerRegistrationRequest = {
  firstName: string
  lastName: string
  address: AddressDto
  phoneNumber: string
  avatarImage?: Blob
  idDocument: Blob[]
  categories?: CategoryType[]
  description: string
}
export type ClientProfileDto = {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  rating: number
  ratingCount: number
  avatarImageUrl?: string
  address: AddressDto
}
export type ClientRegistrationRequest = {
  firstName: string
  lastName: string
  address: AddressDto
  phoneNumber: string
  avatarImage?: Blob
  idDocument: Blob[]
}
export type ProfileInfo = {
  profileId: number
  profileType: ProfileType
  status: ProfileStatus
  displayName: string
}
export type AuthResponse = {
  email: string
  roles: RoleType[]
  activeProfile: ProfileInfo
  allProfiles: ProfileInfo[]
  avatarUrl?: string
}
export type SignupFormRequest = {
  email: string
  password: string
  profileType: ProfileType
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
export type ServiceDto = {
  id: number
  freelancer: BaseProfileDto
  title: string
  description: string
  shortDescription: string
  price: number
  workflow?: WorkflowStep[]
  faqs?: Faq[]
  address?: ServiceAddressDto
  categories: CategoryType[]
  rating: number
  ratingCount: number
  galleryUrls: string[]
  postedAt: string
}
export type ReviewerDto = {
  id: number
  firstName: string
  lastName?: string
  rating: number
  profileType: ProfileType
  avatarImageUrl?: string
}
export type ReviewDto = {
  id: number
  reviewer: ReviewerDto
  body?: string
  rating: number
  createdAt: string
}
export type PageReviewDto = {
  totalPages?: number
  totalElements?: number
  pageable?: PageableObject
  first?: boolean
  last?: boolean
  size?: number
  content?: ReviewDto[]
  number?: number
  sort?: SortObject[]
  numberOfElements?: number
  empty?: boolean
}
export type LightweightTransactionDto = {
  id: number
  status: TransactionStatus
}
export type EventDto = {
  id: number
  type: string
  createdAt: string
  disputeId?: number
}
export type FileDto = {
  id: number
  originalFileName: string
  uploadedAt: string
}
export type OrderDto = {
  id: number
  service: LightweightServiceDto
  client: BaseProfileDto
  status: OrderStatus
  transaction: LightweightTransactionDto
  events: EventDto[]
  additionalNotes?: string
  files: FileDto[]
  rejectionReason?: string
  reviews: ReviewDto[]
  createdAt: string
  deadlineDate: string
  updatedAt?: string
}
export type PageOrderDto = {
  totalPages?: number
  totalElements?: number
  pageable?: PageableObject
  first?: boolean
  last?: boolean
  size?: number
  content?: OrderDto[]
  number?: number
  sort?: SortObject[]
  numberOfElements?: number
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
export type RegistrationRequestDto = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileStatus: ProfileStatus
  rejectionReason?: string
  registrationDate: string
  profileType: ProfileType
}
export enum ProfileType {
  Admin = "ADMIN",
  Client = "CLIENT",
  Freelancer = "FREELANCER",
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
export enum ProfileStatus {
  Unverified = "UNVERIFIED",
  Pending = "PENDING",
  Active = "ACTIVE",
  Rejected = "REJECTED",
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
}
export enum DisputeStatus {
  Open = "OPEN",
  InReview = "IN_REVIEW",
  ResolvedRefunded = "RESOLVED_REFUNDED",
  ResolvedFreelancerPaid = "RESOLVED_FREELANCER_PAID",
  AdminActionRequired = "ADMIN_ACTION_REQUIRED",
  Rejected = "REJECTED",
}
export enum ProposalStatus {
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
  useNotifyAdminMutation,
  useForceReleaseMutation,
  useForceRefundMutation,
  useAcceptProposalMutation,
  useUpdateClientMutation,
  useRejectRegistrationRequestMutation,
  useApproveRegistrationRequestMutation,
  useGetServicesQuery,
  useCreateServiceMutation,
  usePostServiceReviewMutation,
  usePostClientReviewMutation,
  useBookServiceMutation,
  useGetFreelancerQuery,
  useCreateFreelancerMutation,
  useUpdateFreelancerAvatarMutation,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientAvatarMutation,
  useSwitchProfileMutation,
  useRegisterUserMutation,
  useLogoutMutation,
  useAuthenticateUserMutation,
  useAddProfileMutation,
  useCheckEmailMutation,
  useUserAccessQuery,
  useModeratorAccessQuery,
  useAllAccessQuery,
  useAdminAccessQuery,
  useGetStatsOverviewQuery,
  useGetServiceQuery,
  useGetUserServicesQuery,
  useGetServiceReviewsQuery,
  useGetClientReviewsQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetFileQuery,
  useGetDisputeQuery,
  useGetCurrentUserQuery,
  useGetRegistrationRequestsQuery,
  useGetFreelancersRegistrationRequestsQuery,
  useGetClientsRegistrationRequestsQuery,
} = injectedRtkApi
