import { emptySplitApi as api } from "./emptyApi"
export const addTagTypes = [
  "bid-controller",
  "Service",
  "Project",
  "order-controller",
  "Freelancer",
  "employer-controller",
  "Auth",
  "test-controller",
] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: build => ({
      reviewBid: build.mutation<ReviewBidApiResponse, ReviewBidApiArg>({
        query: queryArg => ({
          url: `/bid/review/${queryArg.projectId}/${queryArg.bidId}`,
          method: "PUT",
        }),
        invalidatesTags: ["bid-controller"],
      }),
      declineBid: build.mutation<DeclineBidApiResponse, DeclineBidApiArg>({
        query: queryArg => ({
          url: `/bid/decline/${queryArg.projectId}/${queryArg.bidId}`,
          method: "PUT",
        }),
        invalidatesTags: ["bid-controller"],
      }),
      approveBid: build.mutation<ApproveBidApiResponse, ApproveBidApiArg>({
        query: queryArg => ({
          url: `/bid/approve/${queryArg.projectId}/${queryArg.bidId}`,
          method: "PUT",
        }),
        invalidatesTags: ["bid-controller"],
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
        }),
        providesTags: ["Service"],
      }),
      createProject: build.mutation<
        CreateProjectApiResponse,
        CreateProjectApiArg
      >({
        query: queryArg => ({
          url: `/project`,
          method: "POST",
          body: queryArg.projectCreateDto,
        }),
        invalidatesTags: ["Project"],
      }),
      getFilteredProjects: build.mutation<
        GetFilteredProjectsApiResponse,
        GetFilteredProjectsApiArg
      >({
        query: queryArg => ({
          url: `/project/filter`,
          method: "POST",
          body: queryArg.projectFilter,
        }),
        invalidatesTags: ["Project"],
      }),
      bookService: build.mutation<BookServiceApiResponse, BookServiceApiArg>({
        query: queryArg => ({
          url: `/orders/book/${queryArg.serviceId}`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["order-controller"],
      }),
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
      getFilteredFreelancers: build.mutation<
        GetFilteredFreelancersApiResponse,
        GetFilteredFreelancersApiArg
      >({
        query: queryArg => ({
          url: `/freelancer/filter`,
          method: "POST",
          body: queryArg.freelancerFilter,
        }),
        invalidatesTags: ["Freelancer"],
      }),
      registerEmployer: build.mutation<
        RegisterEmployerApiResponse,
        RegisterEmployerApiArg
      >({
        query: queryArg => ({
          url: `/employer/register`,
          method: "POST",
          body: queryArg.employerRegistrationRequest,
        }),
        invalidatesTags: ["employer-controller"],
      }),
      makeBid: build.mutation<MakeBidApiResponse, MakeBidApiArg>({
        query: queryArg => ({
          url: `/bid/${queryArg.projectId}`,
          method: "POST",
          body: queryArg.bidRequest,
        }),
        invalidatesTags: ["bid-controller"],
      }),
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
      getService: build.query<GetServiceApiResponse, GetServiceApiArg>({
        query: queryArg => ({ url: `/service/${queryArg.id}` }),
        providesTags: ["Service"],
      }),
      getProject: build.query<GetProjectApiResponse, GetProjectApiArg>({
        query: queryArg => ({ url: `/project/${queryArg.projectId}` }),
        providesTags: ["Project"],
      }),
      getOrder: build.query<GetOrderApiResponse, GetOrderApiArg>({
        query: queryArg => ({ url: `/orders/${queryArg.orderId}` }),
        providesTags: ["order-controller"],
      }),
      getFreelancerProfile: build.query<
        GetFreelancerProfileApiResponse,
        GetFreelancerProfileApiArg
      >({
        query: queryArg => ({ url: `/freelancer/profile/${queryArg.id}` }),
        providesTags: ["Freelancer"],
      }),
      getEmployer: build.query<GetEmployerApiResponse, GetEmployerApiArg>({
        query: () => ({ url: `/employer` }),
        providesTags: ["employer-controller"],
      }),
      getFilteredBids: build.query<
        GetFilteredBidsApiResponse,
        GetFilteredBidsApiArg
      >({
        query: queryArg => ({
          url: `/bid/filter`,
          params: {
            projectId: queryArg.projectId,
            rating: queryArg.rating,
            firstName: queryArg.firstName,
            lastName: queryArg.lastName,
            minPrice: queryArg.minPrice,
            maxPrice: queryArg.maxPrice,
            statuses: queryArg.statuses,
          },
        }),
        providesTags: ["bid-controller"],
      }),
        getCurrentUser: build.query<
          GetCurrentUserApiResponse,
          GetCurrentUserApiArg
        >({
          query: () => ({ url: `/auth` }),
          providesTags: ["Auth"],
        }),
      }),
    overrideExisting: false,
  })
export { injectedRtkApi as pcxApi }
export type ReviewBidApiResponse = /** status 200 OK */ Bid
export type ReviewBidApiArg = {
  projectId: number
  bidId: number
}
export type DeclineBidApiResponse = /** status 200 OK */ Bid
export type DeclineBidApiArg = {
  projectId: number
  bidId: number
}
export type ApproveBidApiResponse = /** status 200 OK */ Bid
export type ApproveBidApiArg = {
  projectId: number
  bidId: number
}
export type CreateServiceApiResponse = /** status 201 Created */ FullServiceDto
export type CreateServiceApiArg = {
  service: ServiceCreateDto
}
export type GetFilteredServicesApiResponse =
  /** status 200 OK */ LightweightServiceDto[]
export type GetFilteredServicesApiArg = {
  serviceFilter: ServiceFilter
}
export type CreateProjectApiResponse = /** status 201 Created */ Project
export type CreateProjectApiArg = {
  projectCreateDto: ProjectCreateDto
}
export type GetFilteredProjectsApiResponse =
  /** status 200 OK */ ProjectPublicDto[]
export type GetFilteredProjectsApiArg = {
  projectFilter: ProjectFilter
}
export type BookServiceApiResponse = /** status 200 OK */ MessageResponse
export type BookServiceApiArg = {
  serviceId: number
  body: string
}
export type CreateFreelancerApiResponse =
  /** status 201 Created */ FreelancerDto
export type CreateFreelancerApiArg = {
  registrationRequest: FreelancerRegistrationRequest
}
export type GetFilteredFreelancersApiResponse =
  /** status 200 OK */ FreelancerFilterResponse[]
export type GetFilteredFreelancersApiArg = {
  freelancerFilter: FreelancerFilter
}
export type RegisterEmployerApiResponse = /** status 200 OK */ MessageResponse
export type RegisterEmployerApiArg = {
  employerRegistrationRequest: EmployerRegistrationRequest
}
export type MakeBidApiResponse = /** status 200 OK */ FormResponse
export type MakeBidApiArg = {
  projectId: number
  bidRequest: BidRequest
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
export type GetServiceApiResponse = /** status 200 OK */ FullServiceDto
export type GetServiceApiArg = {
  id: number
}
export type GetProjectApiResponse = /** status 200 Project owner info found */
  | ProjectOwnerDto
  | /** status 203 Project public info found */ ProjectPublicDto
export type GetProjectApiArg = {
  projectId: number
}
export type GetOrderApiResponse = /** status 200 OK */ OrderDto
export type GetOrderApiArg = {
  orderId: number
}
export type GetFreelancerProfileApiResponse = /** status 200 OK */ FreelancerDto
export type GetFreelancerProfileApiArg = {
  id: number
}
export type GetEmployerApiResponse = /** status 200 OK */ EmployerResponseDto
export type GetEmployerApiArg = void
export type GetFilteredBidsApiResponse = /** status 200 OK */ BidDto[]
export type GetFilteredBidsApiArg = {
  projectId: number
  rating?: number
  firstName?: string
  lastName?: string
  minPrice?: number
  maxPrice?: number
  statuses?: BidStatus[]
}
export type GetCurrentUserApiResponse = /** status 200 OK */ AuthResponse
export type GetCurrentUserApiArg = void
export type Address = {
  id?: number
  country: string
  city: string
  street: string
  postalCode: string
  houseNumber: string
  region: string
}
export type File = {
  ownerId: number
  ownerType: OwnerType
  documentType?: DocumentType
  path: string
  originalFileName: string
  verified?: boolean
  uploadAt: string
  id?: number
}
export type Role = {
  id?: number
  name?: RoleType
}
export type Category = {
  id?: number
  name: CategoryType
}
export type Freelancer = {
  id?: number
  address: Address
  description?: string
  firstName: string
  lastName: string
  phoneNumber: string
  avatarUrl?: string
  rating: number
  ratingCount: number
  categories?: Category[]
  accountStatus: AccountStatus
  files?: File[]
  principal: Principal
  registrationDate: string
  activationDate?: string
}
export type Client = {
  id?: number
  principal?: Principal
  address?: Address
  firstName: string
  lastName: string
  avatarUrl?: string
  rating: number
  ratingCount: number
}
export type Principal = {
  id?: number
  email: string
  password: string
  roles: Role[]
  freelancer?: Freelancer
  employer?: Employer
  client?: Client
}
export type Employer = {
  id?: number
  address: Address
  companyName: string
  description: string
  registrationCode: string
  email: string
  phoneNumber: string
  avatarUrl?: string
  rating: number
  ratingCount: number
  accountStatus: AccountStatus
  files?: File[]
  principal: Principal
  registrationDate: string
  activationDate?: string
}
export type Project = {
  id?: number
  title?: string
  description: string
  shortDescription?: string
  employer?: Employer
  freelancer?: Freelancer
  budget?: number
  categories?: Category[]
  status?: ProjectStatus
  location?: string
  bids?: Bid[]
  projectType: ProjectType
  minSatisfyingBid?: number
  bidStep?: number
  datePosted: string
  dueDate?: string
}
export type Bid = {
  id?: number
  project: Project
  freelancer: Freelancer
  amount: number
  status?: BidStatus
  coverLetter: string
  submittedAt: string
  estimatedCompletionDate?: string
  attachments?: File[]
  milestones?: {
    [key: string]: object
  }
}
export type FormValidationResponse = {
  message: string
  errors: {
    [key: string]: string
  }
}
export type ErrorMessage = {
  id?: string
  message?: string
}
export type LightWeightFreelancerDto = {
  id: number
  firstName: string
  lastName: string
  rating: number
  avatarUrl?: string
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
export type AddressDto = {
  street: string
  city: string
  region: string
  postalCode: string
  country: string
  houseNumber: string
}
export type ReviewerDto = {
  id: number
  firstName: string
  lastName?: string
  rating: number
  type: Type
  avatarUrl?: string
}
export type ReviewDto = {
  id: number
  reviewer: ReviewerDto
  body?: string
  rating: number
  createdAt: string
}
export type FileResponseDto = {
  id: number
  originalFileName: string
  documentType: DocumentType
  path: string
  uploadDate: string
  verified: boolean
}
export type FullServiceDto = {
  id: number
  freelancer: LightWeightFreelancerDto
  title: string
  description: string
  price: number
  workflow?: WorkflowStep[]
  faqs?: Faq[]
  address?: AddressDto
  reviews?: ReviewDto[]
  categories: CategoryType[]
  rating: number
  ratingCount: number
  imagesMeta: FileResponseDto[]
  postedAt: string
}
export type ServiceCreateDto = {
  title: string
  description: string
  price: number
  location: string
  categories: CategoryType[]
  images: Blob[]
  workflowJson?: string
  faqsJson?: string
}
export type LightweightAddressDto = {
  city: string
  postalCode: string
  country: string
}
export type LightweightServiceDto = {
  id: number
  title: string
  description: string
  address?: LightweightAddressDto
  rating: number
  ratingCount: number
  price: number
  freelancer: LightWeightFreelancerDto
  categories: CategoryType[]
  postedAt: string
  thumbnailMeta: FileResponseDto
}
export type ServiceFilter = {
  title?: string
  categories: CategoryType[]
  location?: string
  rating: number
  minBudget: number
  maxBudget: number
}
export type ProjectCreateDto = {
  title: string
  description: string
  shortDescription: string
  categories: CategoryType[]
  location: string
  projectType: ProjectType
  budget?: number
  minSatisfyingBid?: number
  bidStep?: number
}
export type EmployerResponseDto = {
  id: number
  companyName: string
  registrationCode: string
  email: string
  address: AddressDto
  phoneNumber: string
  country: string
  description?: string
}
export type ProjectPublicDto = {
  id: number
  title: string
  description: string
  shortDescription?: string
  employer: EmployerResponseDto
  budget?: number
  categories: CategoryType[]
  status: ProjectStatus
  location: string
  projectType: ProjectType
  bidCount?: number
  maxBid?: number
  dueDate?: string
}
export type ProjectFilter = {
  title?: string
  categories?: CategoryType[]
  location?: string
  minBudget?: number
  maxBudget?: number
  type?: ProjectType
}
export type MessageResponse = {
  message: string
  entityId?: number
}
export type BidDto = {
  id: number
  freelancer: LightWeightFreelancerDto
  amount: number
  status: BidStatus
  coverLetter: string
  submittedAt: string
  estimatedCompletionDate: string
}
export type ClientDto = {
  id: number
  address: AddressDto
  firstName: string
  lastName: string
  rating: number
}
export type EventDto = {
  id: number
  clientId?: number
  freelancerId?: number
  type: Type2
  createdAt: string
}
export type OrderDto = {
  id: number
  acceptedBid?: BidDto
  service?: FullServiceDto
  client?: ClientDto
  status: Status
  events: EventDto[]
  createdAt: string
  completedAt?: string
}
export type FreelancerDto = {
  id: number
  address: AddressDto
  firstName: string
  lastName: string
  rating: number
  ratingCount: number
  orders?: OrderDto[]
}
export type FreelancerRegistrationRequest = {
  firstName: string
  lastName: string
  email: string
  address: AddressDto
  phoneNumber: string
  categories: CategoryType[]
  avatarImage?: Blob
  description?: string
}
export type FreelancerFilterResponse = {
  id?: number
  firstName?: string
  lastName?: string
  description?: string
  categories?: CategoryType[]
  addressDto?: AddressDto
  rating?: number
  ratingCount?: number
}
export type FreelancerFilter = {
  firstName?: string
  lastName?: string
  categories?: CategoryType[]
  country?: string
  city?: string
  rating?: number
}
export type EmployerRegistrationRequest = {
  companyName: string
  registrationCode: string
  email: string
  address: AddressDto
  phoneNumber: string
  description?: string
}
export type FormResponse = {
  message?: string
  success?: boolean
}
export type BidRequest = {
  amount: number
  coverLetter?: string
  estimatedCompletionDate?: string
}
export type AuthResponse = {
  firstName?: string
  lastName?: string
  roles: RoleType[]
  activeRoleType: RoleType
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
export type ProjectOwnerDto = {
  id: number
  title: string
  description: string
  shortDescription?: string
  employer: EmployerResponseDto
  budget?: number
  categories: CategoryType[]
  status: ProjectStatus
  location: string
  projectType: ProjectType
  bidCount?: number
  maxBid?: number
  dueDate?: string
  bids: BidDto[]
}
export enum AccountStatus {
  Unverified = "UNVERIFIED",
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Deleted = "DELETED",
  Banned = "BANNED",
}
export enum OwnerType {
  Service = "SERVICE",
  Project = "PROJECT",
  Client = "CLIENT",
  Freelancer = "FREELANCER",
  Employer = "EMPLOYER",
}
export enum DocumentType {
  IdCard = "ID_CARD",
  Passport = "PASSPORT",
  DrivingLicense = "DRIVING_LICENSE",
  BusinessLicense = "BUSINESS_LICENSE",
  CompanyRegistration = "COMPANY_REGISTRATION",
  BankStatement = "BANK_STATEMENT",
  Other = "OTHER",
  Gallery = "GALLERY",
  Avatar = "AVATAR",
}
export enum RoleType {
  RoleEmployer = "ROLE_EMPLOYER",
  RoleFreelancer = "ROLE_FREELANCER",
  RoleAdmin = "ROLE_ADMIN",
  RoleUnverified = "ROLE_UNVERIFIED",
  RoleClient = "ROLE_CLIENT",
}
export enum CategoryType {
  WebDesign = "WEB_DESIGN",
  WebDevelopment = "WEB_DEVELOPMENT",
  MobileDevelopment = "MOBILE_DEVELOPMENT",
  GraphicDesign = "GRAPHIC_DESIGN",
  VideoEditing = "VIDEO_EDITING",
  Writing = "WRITING",
  Translation = "TRANSLATION",
  Marketing = "MARKETING",
  Sales = "SALES",
  CustomerService = "CUSTOMER_SERVICE",
  AdminSupport = "ADMIN_SUPPORT",
  DataScience = "DATA_SCIENCE",
  Engineering = "ENGINEERING",
  Accounting = "ACCOUNTING",
  Legal = "LEGAL",
  Other = "OTHER",
}
export enum ProjectStatus {
  Open = "OPEN",
  InProgress = "IN_PROGRESS",
  Closed = "CLOSED",
}
export enum ProjectType {
  Bid = "BID",
  Fixed = "FIXED",
}
export enum BidStatus {
  New = "NEW",
  InReview = "IN_REVIEW",
  Approved = "APPROVED",
  Declined = "DECLINED",
}
export enum Type {
  Employer = "Employer",
  Client = "Client",
  Freelancer = "Freelancer",
}
export enum Status {
  Created = "CREATED",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Canceled = "CANCELED",
}
export enum Type2 {
  OrderCreated = "ORDER_CREATED",
  OrderCanceled = "ORDER_CANCELED",
  OrderCompleted = "ORDER_COMPLETED",
  OrderPaid = "ORDER_PAID",
  OrderDisputed = "ORDER_DISPUTED",
  OrderReviewed = "ORDER_REVIEWED",
  OrderAccepted = "ORDER_ACCEPTED",
  OrderDeclined = "ORDER_DECLINED",
  OrderInProgress = "ORDER_IN_PROGRESS",
  OrderDelivered = "ORDER_DELIVERED",
  OrderRefunded = "ORDER_REFUNDED",
  OrderModified = "ORDER_MODIFIED",
  OrderResolved = "ORDER_RESOLVED",
}
export const {
  useReviewBidMutation,
  useDeclineBidMutation,
  useApproveBidMutation,
  useCreateServiceMutation,
  useGetFilteredServicesQuery,
  useCreateProjectMutation,
  useGetFilteredProjectsMutation,
  useBookServiceMutation,
  useCreateFreelancerMutation,
  useGetFilteredFreelancersMutation,
  useRegisterEmployerMutation,
  useMakeBidMutation,
  useSwitchRoleMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useAuthenticateUserMutation,
  useCheckEmailMutation,
  useUserAccessQuery,
  useModeratorAccessQuery,
  useAllAccessQuery,
  useAdminAccessQuery,
  useGetServiceQuery,
  useGetProjectQuery,
  useGetOrderQuery,
  useGetFreelancerProfileQuery,
  useGetEmployerQuery,
  useGetFilteredBidsQuery,
  useGetCurrentUserQuery,
} = injectedRtkApi
