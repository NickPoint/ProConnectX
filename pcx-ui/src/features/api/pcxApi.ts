import { emptySplitApi as api } from "./emptyApi"
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    listAllFormsOfMetadata1: build.query<
      ListAllFormsOfMetadata1ApiResponse,
      ListAllFormsOfMetadata1ApiArg
    >({
      query: () => ({ url: `/profile` }),
    }),
    descriptor111: build.query<Descriptor111ApiResponse, Descriptor111ApiArg>({
      query: () => ({ url: `/profile/uploadedFiles` }),
    }),
    getUploadedFiles: build.query<
      GetUploadedFilesApiResponse,
      GetUploadedFilesApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles`,
        params: {
          page: queryArg.page,
          size: queryArg.size,
          sort: queryArg.sort,
        },
      }),
    }),
    postUploadedFiles: build.mutation<
      PostUploadedFilesApiResponse,
      PostUploadedFilesApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles`,
        method: "POST",
        body: queryArg.uploadedFileRequestBody,
      }),
    }),
    getUploadedFilesSearchFindAllByPrincipal: build.query<
      GetUploadedFilesSearchFindAllByPrincipalApiResponse,
      GetUploadedFilesSearchFindAllByPrincipalApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles/search/findAllByPrincipal`,
        params: {
          principal: queryArg.principal,
        },
      }),
    }),
    getUploadedFilesById: build.query<
      GetUploadedFilesByIdApiResponse,
      GetUploadedFilesByIdApiArg
    >({
      query: queryArg => ({ url: `/uploadedFiles/${queryArg.id}` }),
    }),
    putUploadedFilesById: build.mutation<
      PutUploadedFilesByIdApiResponse,
      PutUploadedFilesByIdApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles/${queryArg.id}`,
        method: "PUT",
        body: queryArg.uploadedFileRequestBody,
      }),
    }),
    deleteUploadedFilesById: build.mutation<
      DeleteUploadedFilesByIdApiResponse,
      DeleteUploadedFilesByIdApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    patchUploadedFilesById: build.mutation<
      PatchUploadedFilesByIdApiResponse,
      PatchUploadedFilesByIdApiArg
    >({
      query: queryArg => ({
        url: `/uploadedFiles/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.uploadedFileRequestBody,
      }),
    }),
    reviewBid: build.mutation<ReviewBidApiResponse, ReviewBidApiArg>({
      query: queryArg => ({
        url: `/bid/review/${queryArg.projectId}/${queryArg.bidId}`,
        method: "PUT",
      }),
    }),
    declineBid: build.mutation<DeclineBidApiResponse, DeclineBidApiArg>({
      query: queryArg => ({
        url: `/bid/decline/${queryArg.projectId}/${queryArg.bidId}`,
        method: "PUT",
      }),
    }),
    approveBid: build.mutation<ApproveBidApiResponse, ApproveBidApiArg>({
      query: queryArg => ({
        url: `/bid/approve/${queryArg.projectId}/${queryArg.bidId}`,
        method: "PUT",
      }),
    }),
    createService: build.mutation<
      CreateServiceApiResponse,
      CreateServiceApiArg
    >({
      query: queryArg => ({
        url: `/service`,
        method: "POST",
        body: queryArg.serviceCreateDto,
      }),
    }),
    getFilteredServices: build.mutation<
      GetFilteredServicesApiResponse,
      GetFilteredServicesApiArg
    >({
      query: queryArg => ({
        url: `/service/filter`,
        method: "POST",
        body: queryArg.serviceFilter,
      }),
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
    }),
    uploadFile: build.mutation<UploadFileApiResponse, UploadFileApiArg>({
      query: queryArg => ({
        url: `/files/upload`,
        method: "POST",
        params: {
          fileUploadRequest: queryArg.fileUploadRequest,
        },
      }),
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
    }),
    makeBid: build.mutation<MakeBidApiResponse, MakeBidApiArg>({
      query: queryArg => ({
        url: `/bid/${queryArg.projectId}`,
        method: "POST",
        body: queryArg.bidRequest,
      }),
    }),
    switchRole: build.mutation<SwitchRoleApiResponse, SwitchRoleApiArg>({
      query: queryArg => ({
        url: `/auth/switch-role`,
        method: "POST",
        params: {
          role: queryArg.role,
        },
      }),
    }),
    registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>({
      query: queryArg => ({
        url: `/auth/signup`,
        method: "POST",
        body: queryArg.signupFormRequest,
      }),
    }),
    logoutUser: build.mutation<LogoutUserApiResponse, LogoutUserApiArg>({
      query: () => ({ url: `/auth/logout`, method: "POST" }),
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
    }),
    userAccess: build.query<UserAccessApiResponse, UserAccessApiArg>({
      query: () => ({ url: `/test/user` }),
    }),
    moderatorAccess: build.query<
      ModeratorAccessApiResponse,
      ModeratorAccessApiArg
    >({
      query: () => ({ url: `/test/freelancer` }),
    }),
    allAccess: build.query<AllAccessApiResponse, AllAccessApiArg>({
      query: () => ({ url: `/test/all` }),
    }),
    adminAccess: build.query<AdminAccessApiResponse, AdminAccessApiArg>({
      query: () => ({ url: `/test/admin` }),
    }),
    getService: build.query<GetServiceApiResponse, GetServiceApiArg>({
      query: queryArg => ({ url: `/service/${queryArg.id}` }),
    }),
    getProject: build.query<GetProjectApiResponse, GetProjectApiArg>({
      query: queryArg => ({ url: `/project/${queryArg.projectId}` }),
    }),
    getFreelancerProfile: build.query<
      GetFreelancerProfileApiResponse,
      GetFreelancerProfileApiArg
    >({
      query: queryArg => ({ url: `/freelancer/profile/${queryArg.id}` }),
    }),
    getPrincipalFiles: build.query<
      GetPrincipalFilesApiResponse,
      GetPrincipalFilesApiArg
    >({
      query: () => ({ url: `/files` }),
    }),
    downloadFile: build.query<DownloadFileApiResponse, DownloadFileApiArg>({
      query: queryArg => ({ url: `/files/download/${queryArg.fileId}` }),
    }),
    getEmployer: build.query<GetEmployerApiResponse, GetEmployerApiArg>({
      query: () => ({ url: `/employer` }),
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
    }),
    getCurrentUser: build.query<
      GetCurrentUserApiResponse,
      GetCurrentUserApiArg
    >({
      query: () => ({ url: `/auth` }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as pcxApi }
export type ListAllFormsOfMetadata1ApiResponse =
  /** status 200 OK */ RepresentationModelObject
export type ListAllFormsOfMetadata1ApiArg = void
export type Descriptor111ApiResponse = /** status 200 OK */ string
export type Descriptor111ApiArg = void
export type GetUploadedFilesApiResponse =
  /** status 200 OK */ PagedModelEntityModelUploadedFile
export type GetUploadedFilesApiArg = {
  /** Zero-based page index (0..N) */
  page?: number
  /** The size of the page to be returned */
  size?: number
  /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
  sort?: string[]
}
export type PostUploadedFilesApiResponse =
  /** status 201 Created */ EntityModelUploadedFile
export type PostUploadedFilesApiArg = {
  uploadedFileRequestBody: UploadedFileRequestBody
}
export type GetUploadedFilesSearchFindAllByPrincipalApiResponse =
  /** status 200 OK */ CollectionModelEntityModelUploadedFile
export type GetUploadedFilesSearchFindAllByPrincipalApiArg = {
  principal?: Principal
}
export type GetUploadedFilesByIdApiResponse =
  /** status 200 OK */ EntityModelUploadedFile
export type GetUploadedFilesByIdApiArg = {
  id: string
}
export type PutUploadedFilesByIdApiResponse = /** status 200 OK */
  | EntityModelUploadedFile
  | /** status 201 Created */ EntityModelUploadedFile
export type PutUploadedFilesByIdApiArg = {
  id: string
  uploadedFileRequestBody: UploadedFileRequestBody
}
export type DeleteUploadedFilesByIdApiResponse = unknown
export type DeleteUploadedFilesByIdApiArg = {
  id: string
}
export type PatchUploadedFilesByIdApiResponse =
  /** status 200 OK */ EntityModelUploadedFile
export type PatchUploadedFilesByIdApiArg = {
  id: string
  uploadedFileRequestBody: UploadedFileRequestBody
}
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
export type CreateServiceApiResponse = /** status 200 OK */ ServiceDao
export type CreateServiceApiArg = {
  serviceCreateDto: ServiceCreateDto
}
export type GetFilteredServicesApiResponse =
  /** status 200 OK */ ServiceFilterResponse[]
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
export type GetFilteredFreelancersApiResponse =
  /** status 200 OK */ FreelancerFilterResponse[]
export type GetFilteredFreelancersApiArg = {
  freelancerFilter: FreelancerFilter
}
export type UploadFileApiResponse = /** status 200 OK */ MessageResponse
export type UploadFileApiArg = {
  fileUploadRequest: FileUploadRequest
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
  role: string
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
export type UserAccessApiResponse = /** status 200 OK */ string
export type UserAccessApiArg = void
export type ModeratorAccessApiResponse = /** status 200 OK */ string
export type ModeratorAccessApiArg = void
export type AllAccessApiResponse = /** status 200 OK */ string
export type AllAccessApiArg = void
export type AdminAccessApiResponse = /** status 200 OK */ string
export type AdminAccessApiArg = void
export type GetServiceApiResponse = /** status 200 OK */ ServiceDao
export type GetServiceApiArg = {
  id: number
}
export type GetProjectApiResponse = /** status 200 Project owner info found */
  | ProjectOwnerDto
  | /** status 203 Project public info found */ ProjectPublicDto
export type GetProjectApiArg = {
  projectId: number
}
export type GetFreelancerProfileApiResponse = /** status 200 OK */ Freelancer
export type GetFreelancerProfileApiArg = {
  id: number
}
export type GetPrincipalFilesApiResponse =
  /** status 200 OK */ FileResponseDto[]
export type GetPrincipalFilesApiArg = void
export type DownloadFileApiResponse = /** status 200 OK */ Blob
export type DownloadFileApiArg = {
  fileId: number
}
export type GetEmployerApiResponse = /** status 200 OK */ EmployerResponseDto
export type GetEmployerApiArg = void
export type GetFilteredBidsApiResponse = /** status 200 OK */ BidCardDto[]
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
export type Link = {
  href?: string
  hreflang?: string
  title?: string
  type?: string
  deprecation?: string
  profile?: string
  name?: string
  templated?: boolean
}
export type Links = {
  [key: string]: Link
}
export type RepresentationModelObject = {
  _links?: Links
}
export type Role = {
  id?: number
  name?: ERole
}
export type Category = {
  id?: number
  name?: ECategory
}
export type Employer = {
  id?: number
  companyName: string
  description?: string
  country: string
  registrationCode: string
  email?: string
  phoneNumber: string
  profilePicture?: string
  address: string
  rating?: number
  ratingCount?: number
  accountStatus: AccountStatus
  documents?: Document[]
  principal: Principal
  registrationDate: string
  activationDate?: string
}
export type Document = {
  id?: number
  freelancer: Freelancer
  employer: Employer
  documentName: DocumentType
  documentPath: string
  verified: boolean
  uploadedDate: string
}
export type Freelancer = {
  id?: number
  description?: string
  firstName: string
  lastName: string
  country: string
  phoneNumber: string
  profilePicture?: string
  address?: string
  rating?: number
  ratingCount?: number
  categories?: Category[]
  accountStatus: AccountStatus
  documents?: Document[]
  principal: Principal
  registrationDate: string
  activationDate?: string
}
export type Principal = {
  id?: number
  email?: string
  firstName: string
  lastName: string
  password: string
  roles?: Role[]
  freelancer?: Freelancer
  employer?: Employer
}
export type EntityModelUploadedFile = {
  type: string
  documentType?: DocumentType
  path: string
  fileName: string
  verified?: boolean
  uploadDate: string
  principal?: Principal
  id?: number
  _links?: Links
}
export type PageMetadata = {
  size?: number
  totalElements?: number
  totalPages?: number
  number?: number
}
export type PagedModelEntityModelUploadedFile = {
  _embedded?: {
    uploadedFiles?: EntityModelUploadedFile[]
  }
  _links?: Links
  page?: PageMetadata
}
export type UploadedFileRequestBody = {
  type: string
  documentType?: DocumentType
  path: string
  fileName: string
  verified?: boolean
  uploadDate: string
  principal?: Principal
  id?: number
}
export type CollectionModelEntityModelUploadedFile = {
  _embedded?: {
    uploadedFiles?: EntityModelUploadedFile[]
  }
  _links?: Links
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
  project?: Project
  bidder?: Freelancer
  amount?: number
  status?: BidStatus
  coverLetter?: string
  shortCoverLetter?: string
  datePosted?: string
  dateSubmitted?: string
  dueDate?: string
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
export type Comment = object
export type ServiceDao = {
  id?: number
  title?: string
  description?: string
  price?: number
  freelancer?: Freelancer
  comments?: Comment[]
  location?: string
  category?: Category
  rating?: number
  ratingCount?: number
  datePosted?: string
}
export type ServiceCreateDto = {
  title: string
  description: string
  price: number
  location: string
  category: ECategory
}
export type FreelancerMainInfo = {
  id?: number
  firstName?: string
  lastName?: string
  profilePicture?: string
  rating?: number
  ratingCount?: number
}
export type ServiceFilterResponse = {
  id?: number
  title?: string
  description?: string
  location?: string
  rating?: number
  ratingCount?: number
  price?: number
  freelancer?: FreelancerMainInfo
  category?: ECategory
}
export type ServiceFilter = {
  title?: string
  categories?: ECategory[]
  location?: string
  rating?: number
  minBudget?: number
  maxBudget?: number
}
export type ProjectCreateDto = {
  title: string
  description: string
  shortDescription: string
  categories: ECategory[]
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
  address: string
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
  categories: ECategory[]
  status: ProjectStatus
  location: string
  projectType: ProjectType
  bidCount?: number
  maxBid?: number
  dueDate?: string
}
export type ProjectFilter = {
  title?: string
  categories?: ECategory[]
  location?: string
  minBudget?: number
  maxBudget?: number
  type?: ProjectType
}
export type FreelancerFilterResponse = {
  id?: number
  firstName?: string
  lastName?: string
  description?: string
  categories?: ECategory[]
  location?: string
  rating?: number
  ratingCount?: number
}
export type FreelancerFilter = {
  firstName?: string
  lastName?: string
  categories?: ECategory[]
  location?: string
  rating?: number
}
export type MessageResponse = {
  message: string
  entityId?: number
}
export type FileUploadRequest = {
  documentType: DocumentType
  file: Blob
}
export type EmployerRegistrationRequest = {
  companyName: string
  registrationCode: string
  email: string
  address: string
  phoneNumber: string
  country: string
  description?: string
}
export type FormResponse = {
  message?: string
  success?: boolean
}
export type BidRequest = {
  amount: number
  coverLetter?: string
  shortCoverLetter?: string
  dueDate?: string
}
export type AuthResponse = {
  firstName: string
  lastName: string
  roles: string[]
  activeRole: string
}
export type SignupFormRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}
export type LoginRequest = {
  email: string
  password: string
}
export type BidCardDto = {
  id: number
  amount: number
  bidder: FreelancerMainInfo
  coverLetter?: string
  shortCoverLetter?: string
  status: BidStatus
  dueDate?: string
  datePosted: string
}
export type ProjectOwnerDto = {
  id: number
  title: string
  description: string
  shortDescription?: string
  employer: EmployerResponseDto
  budget?: number
  categories: ECategory[]
  status: ProjectStatus
  location: string
  projectType: ProjectType
  bidCount?: number
  maxBid?: number
  dueDate?: string
  bids: BidCardDto[]
}
export type FileResponseDto = {
  id: number
  fileName: string
  documentType: DocumentType
  uploadDate: string
  verified: boolean
}
export enum DocumentType {
  IdCard = "ID_CARD",
  Passport = "PASSPORT",
  DrivingLicense = "DRIVING_LICENSE",
  BusinessLicense = "BUSINESS_LICENSE",
  CompanyRegistration = "COMPANY_REGISTRATION",
  BankStatement = "BANK_STATEMENT",
  Other = "OTHER",
}
export enum ERole {
  RoleEmployer = "ROLE_EMPLOYER",
  RoleFreelancer = "ROLE_FREELANCER",
  RoleAdmin = "ROLE_ADMIN",
  RoleUnverified = "ROLE_UNVERIFIED",
}
export enum ECategory {
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
export enum AccountStatus {
  Unverified = "UNVERIFIED",
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Deleted = "DELETED",
  Banned = "BANNED",
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
export const {
  useListAllFormsOfMetadata1Query,
  useDescriptor111Query,
  useGetUploadedFilesQuery,
  usePostUploadedFilesMutation,
  useGetUploadedFilesSearchFindAllByPrincipalQuery,
  useGetUploadedFilesByIdQuery,
  usePutUploadedFilesByIdMutation,
  useDeleteUploadedFilesByIdMutation,
  usePatchUploadedFilesByIdMutation,
  useReviewBidMutation,
  useDeclineBidMutation,
  useApproveBidMutation,
  useCreateServiceMutation,
  useGetFilteredServicesMutation,
  useCreateProjectMutation,
  useGetFilteredProjectsMutation,
  useGetFilteredFreelancersMutation,
  useUploadFileMutation,
  useRegisterEmployerMutation,
  useMakeBidMutation,
  useSwitchRoleMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useAuthenticateUserMutation,
  useUserAccessQuery,
  useModeratorAccessQuery,
  useAllAccessQuery,
  useAdminAccessQuery,
  useGetServiceQuery,
  useGetProjectQuery,
  useGetFreelancerProfileQuery,
  useGetPrincipalFilesQuery,
  useDownloadFileQuery,
  useGetEmployerQuery,
  useGetFilteredBidsQuery,
  useGetCurrentUserQuery,
} = injectedRtkApi
