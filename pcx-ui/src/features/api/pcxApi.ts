import { emptySplitApi as api } from "./emptyApi"
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
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
    getFilteredOffers: build.query<
      GetFilteredOffersApiResponse,
      GetFilteredOffersApiArg
    >({
      query: queryArg => ({
        url: `/offer`,
        params: { offerFilter: queryArg.offerFilter },
      }),
    }),
    createOffer: build.mutation<CreateOfferApiResponse, CreateOfferApiArg>({
      query: queryArg => ({
        url: `/offer`,
        method: "POST",
        body: queryArg.offer,
      }),
    }),
    makeBid: build.mutation<MakeBidApiResponse, MakeBidApiArg>({
      query: queryArg => ({
        url: `/bid/${queryArg.projectId}`,
        method: "POST",
        body: queryArg.bidRequest,
      }),
    }),
    registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>({
      query: queryArg => ({
        url: `/auth/signup`,
        method: "POST",
        body: queryArg.signupRequest,
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
    getFilteredFreelancers: build.query<
      GetFilteredFreelancersApiResponse,
      GetFilteredFreelancersApiArg
    >({
      query: queryArg => ({
        url: `/client`,
        params: { freelancerFilter: queryArg.freelancerFilter },
      }),
    }),
    getClientProfile: build.query<
      GetClientProfileApiResponse,
      GetClientProfileApiArg
    >({
      query: queryArg => ({ url: `/client/profile/${queryArg.id}` }),
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
export type CreateProjectApiResponse = /** status 200 OK */ Project
export type CreateProjectApiArg = {
  projectCreateDto: ProjectCreateDto
}
export type GetFilteredProjectsApiResponse =
  /** status 200 OK */ ProjectFilterResponse[]
export type GetFilteredProjectsApiArg = {
  projectFilter: ProjectFilter
}
export type GetFilteredOffersApiResponse = /** status 200 OK */ Offer[]
export type GetFilteredOffersApiArg = {
  offerFilter: OfferFilter
}
export type CreateOfferApiResponse = /** status 200 OK */ Offer
export type CreateOfferApiArg = {
  offer: Offer
}
export type MakeBidApiResponse = /** status 200 OK */ Bid
export type MakeBidApiArg = {
  projectId: number
  bidRequest: BidRequest
}
export type RegisterUserApiResponse = /** status 200 OK */ object
export type RegisterUserApiArg = {
  signupRequest: SignupRequest
}
export type LogoutUserApiResponse = /** status 200 OK */ object
export type LogoutUserApiArg = void
export type AuthenticateUserApiResponse = /** status 200 OK */ object
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
export type GetFilteredFreelancersApiResponse = /** status 200 OK */ Client[]
export type GetFilteredFreelancersApiArg = {
  freelancerFilter: FreelancerFilter
}
export type GetClientProfileApiResponse = /** status 200 OK */ Client
export type GetClientProfileApiArg = {
  id: number
}
export type GetCurrentUserApiResponse = /** status 200 OK */ UserInfoResponse
export type GetCurrentUserApiArg = void
export type Role = {
  id?: number
  name?: "ROLE_CLIENT" | "ROLE_FREELANCER" | "ROLE_ADMIN"
}
export type Category = {
  id?: number
  name?:
    | "WEB_DESIGN"
    | "WEB_DEVELOPMENT"
    | "MOBILE_DEVELOPMENT"
    | "GRAPHIC_DESIGN"
    | "VIDEO_EDITING"
    | "WRITING"
    | "TRANSLATION"
    | "MARKETING"
    | "SALES"
    | "CUSTOMER_SERVICE"
    | "ADMIN_SUPPORT"
    | "DATA_SCIENCE"
    | "ENGINEERING"
    | "ACCOUNTING"
    | "LEGAL"
    | "OTHER"
}
export type Client = {
  id?: number
  name: string
  email: string
  password: string
  username?: string
  roles?: Role[]
  profilePicture?: string
  location?: string
  rating?: number
  categories?: Category[]
}
export type Project = {
  id?: number
  title?: string
  description?: string
  shortDescription?: string
  owner?: Client
  freelancer?: Client
  budget?: number
  category?: Category
  status?: "OPEN" | "IN_PROGRESS" | "CLOSED"
  location?: string
  bids?: Bid[]
  datePosted?: string
  dueDate?: string
}
export type Bid = {
  id?: number
  project?: Project
  freelancer?: Client
  amount?: number
  bidStatus?: "NEW" | "IN_REVIEW" | "APPROVED" | "DECLINED"
  description?: string
  datePosted?: string
  dateSubmitted?: string
}
export type ErrorMessage = {
  id?: string
  message?: string
}
export type ProjectCreateDto = {
  title: string
  description: string
  shortDescription: string
  budget: number
  category:
    | "WEB_DESIGN"
    | "WEB_DEVELOPMENT"
    | "MOBILE_DEVELOPMENT"
    | "GRAPHIC_DESIGN"
    | "VIDEO_EDITING"
    | "WRITING"
    | "TRANSLATION"
    | "MARKETING"
    | "SALES"
    | "CUSTOMER_SERVICE"
    | "ADMIN_SUPPORT"
    | "DATA_SCIENCE"
    | "ENGINEERING"
    | "ACCOUNTING"
    | "LEGAL"
    | "OTHER"
  location: string
}
export type ProjectFilterResponse = {
  id?: number
  title?: string
  shortDescription?: string
  owner?: Client
  budget?: number
  category?:
    | "WEB_DESIGN"
    | "WEB_DEVELOPMENT"
    | "MOBILE_DEVELOPMENT"
    | "GRAPHIC_DESIGN"
    | "VIDEO_EDITING"
    | "WRITING"
    | "TRANSLATION"
    | "MARKETING"
    | "SALES"
    | "CUSTOMER_SERVICE"
    | "ADMIN_SUPPORT"
    | "DATA_SCIENCE"
    | "ENGINEERING"
    | "ACCOUNTING"
    | "LEGAL"
    | "OTHER"
  status?: "OPEN" | "IN_PROGRESS" | "CLOSED"
  location?: string
  bidCount?: number
  lastBid?: number
  dueDate?: string
}
export type ProjectFilter = {
  title?: string
  categories?: (
    | "WEB_DESIGN"
    | "WEB_DEVELOPMENT"
    | "MOBILE_DEVELOPMENT"
    | "GRAPHIC_DESIGN"
    | "VIDEO_EDITING"
    | "WRITING"
    | "TRANSLATION"
    | "MARKETING"
    | "SALES"
    | "CUSTOMER_SERVICE"
    | "ADMIN_SUPPORT"
    | "DATA_SCIENCE"
    | "ENGINEERING"
    | "ACCOUNTING"
    | "LEGAL"
    | "OTHER"
  )[]
  location?: string
  minBudget?: number
  maxBudget?: number
}
export type Offer = object
export type BoundDouble = {
  value?: number
  inclusive?: boolean
  bounded?: boolean
}
export type RangeDouble = {
  lowerBound?: BoundDouble
  upperBound?: BoundDouble
}
export type OfferFilter = {
  categories?: Category[]
  location?: string
  rating?: number
  price?: RangeDouble
}
export type BidRequest = {
  description?: string
  price?: number
}
export type SignupRequest = {
  name: string
  email: string
  role?: string[]
  password: string
}
export type LoginRequest = {
  email: string
  password: string
}
export type FreelancerFilter = {
  categories?: Category[]
  location?: string
  rating?: number
}
export type UserInfoResponse = {
  id?: number
  email?: string
  roles?: string[]
}
export const {
  useReviewBidMutation,
  useDeclineBidMutation,
  useApproveBidMutation,
  useCreateProjectMutation,
  useGetFilteredProjectsMutation,
  useGetFilteredOffersQuery,
  useCreateOfferMutation,
  useMakeBidMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useAuthenticateUserMutation,
  useUserAccessQuery,
  useModeratorAccessQuery,
  useAllAccessQuery,
  useAdminAccessQuery,
  useGetFilteredFreelancersQuery,
  useGetClientProfileQuery,
  useGetCurrentUserQuery,
} = injectedRtkApi
