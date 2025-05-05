import "./App.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./app/components/layouts/Layout";
import HomePage from "./app/pages/HomePage";
import RequireUser from "./app/components/RequireUser";
import PostServicePage from "./app/components/services/PostServicePage";
import ServiceLayout from "./app/components/layouts/ServiceLayout.tsx";
import ServicePage from "./app/components/services/ServicePage";
import FreelancerVerificationPage from "./app/pages/FreelancerVerificationPage.tsx";
import ServicesFilter from "./app/components/services/ServicesFilter.tsx";
import NotFound from "./app/components/NotFound.tsx";
import LayoutWithTitle from "./app/components/layouts/LayoutWithTitle.tsx";
import {GlobalLoadingBackdrop} from "./app/components/GlobalLoadingBackdrop.tsx";
import {AccountStatus, AccountType, RoleType, useGetCurrentUserQuery} from "./features/api/pcxApi.ts";
import Dashboard from "./app/pages/Dashboard.tsx";
import DashboardOverviewTab from "./app/components/dashboard/DashboardOverviewTab.tsx";
import RegistrationRequestTab from "./app/components/dashboard/RegistrationRequestTab.tsx";
import UnauthorizedPage from "./app/pages/UnauthorizedPage.tsx";
import AuthPage from "./app/pages/AuthPage.tsx";
import ClientVerificationPage from "./app/pages/ClientVerificationPage.tsx";
import OrdersTab from "./app/components/dashboard/OrdersTab.tsx";
import SettingsTab from "./app/components/dashboard/SettingsTab.tsx";

const App = () => {

    useGetCurrentUserQuery();

    return (
        <div className="App">
            <BrowserRouter>
                <GlobalLoadingBackdrop />
                <Routes>
                    <Route path='/' element={<Layout/>}>
                        <Route index element={<HomePage/>}/>
                        {/*<Route path='projects' element={<FilterPage type={FilterType.PROJETCS}/>}/>*/}
                        {/*<Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>*/}
                        {/*    <Route path='projects/add' element={<PostProjectPage/>}/>*/}
                        {/*</Route>*/}
                        {/*TODO: <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>*/}
                        <Route path='auth' element={<AuthPage />}/>
                        <Route path='freelancer-verification' element={
                            <RequireUser allowedRoles={[RoleType.RoleUnverified, RoleType.RoleAdmin]}
                                         dissalowedAccountsStatuses={[{type: AccountType.Client, status: AccountStatus.Pending},
                                             {type: AccountType.Freelancer, status: AccountStatus.Pending}]}>
                                <FreelancerVerificationPage/>
                            </RequireUser>}/>
                        <Route path='client-verification' element={
                            <RequireUser allowedRoles={[RoleType.RoleUnverified, RoleType.RoleAdmin]}
                                         dissalowedAccountsStatuses={[{type: AccountType.Client, status: AccountStatus.Pending},
                                             {type: AccountType.Freelancer, status: AccountStatus.Pending}]}>
                                <ClientVerificationPage/>
                            </RequireUser>}/>
                        <Route path='service/add' element={
                            <RequireUser allowedRoles={[RoleType.RoleFreelancer, RoleType.RoleAdmin]}>
                                <PostServicePage/>
                            </RequireUser>}/>
                        <Route path='services' element={<ServicesFilter/>}/>
                    </Route>
                    <Route path='/' element={<LayoutWithTitle/>}>
                        <Route path='unauthorized' element={<UnauthorizedPage />} />
                    </Route>
                    {/*<Route path='/' element={<Layout2/>}>*/}
                    {/*    <Route path='project/:id' element={<ProjectPage/>}/>*/}
                    {/*    <Route element={<RequireUser allowedRoles={[R, 'ROLE_ADMIN']}/>}>*/}
                    {/*        <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>*/}
                    {/*    </Route>*/}
                    {/*    <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>*/}
                    {/*        <Route path='project/:id/amend' element={<ApplyForProjectPage/>}/>*/}
                    {/*        <Route path='project/:id/bids' element={<FilterPage type={FilterType.BIDS}/>}/>*/}
                    {/*    </Route>*/}
                    {/*    <Route path='project/:projectId/bids/:id' element={<BidPage/>}/>*/}
                    {/*</Route>*/}
                    <Route path='/' element={<ServiceLayout/>}>
                        <Route path='service/:id' element={<ServicePage/>}/>
                    </Route>
                    <Route path='/dashboard' element={<RequireUser allowedRoles={[RoleType.RoleFreelancer, RoleType.RoleAdmin, RoleType.RoleClient, RoleType.RoleUnverified]}>
                        <Dashboard />
                    </RequireUser>}>
                        <Route path='home' element={<DashboardOverviewTab />} />
                        <Route path='registrations' element={<RegistrationRequestTab />} />
                        <Route path='orders' element={<OrdersTab />} />
                        <Route path='settings' element={<SettingsTab />} />
                    </Route>
                    <Route path='*' element={<NotFound />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

// return (
//     <div className="App">
//         <BrowserRouter>
//             <GlobalLoadingBackdrop />
//             <Routes>
//                 <Route path='/' element={<Layout/>}>
//                     <Route index element={<HomePage/>}/>
//                     <Route path='projects' element={<FilterPage type={FilterType.PROJETCS}/>}/>
//                     <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
//                         <Route path='projects/add' element={<PostProjectPage/>}/>
//                     </Route>
//                     <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>
//                     <Route path='services' element={<ServicesFilter/>}/>
//                     <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
//                         <Route path='services/add' element={<PostServicePage/>}/>
//                     </Route>
//                 </Route>
//                 <Route path='login' element={<LoginPage/>}/>
//                 <Route path='signup' element={<AuthDialog/>}/>
//                 <Route element={<RequireUser allowedRoles={['ROLE_UNVERIFI', 'ROLE_ADMIN']}/>}/>
//                 <Route path='/' element={<LayoutWithTitle />}>
//                     <Route path='verification' element={<VerificationPage/>}/>
//                 </Route>
//                 <Route path='/' element={<Layout2/>}>
//                     <Route path='project/:id' element={<ProjectPage/>}/>
//                     <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
//                         <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>
//                     </Route>
//                     <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
//                         <Route path='project/:id/amend' element={<ApplyForProjectPage/>}/>
//                         <Route path='project/:id/bids' element={<FilterPage type={FilterType.BIDS}/>}/>
//                     </Route>
//                     <Route path='project/:projectId/bids/:id' element={<BidPage/>}/>
//                 </Route>
//                 <Route path='/' element={<ServiceLayout/>}>
//                     <Route path='service/:id' element={<ServicePage/>}/>
//                     <Route path='order/:id' element={<OrderPage/>}/>
//                 </Route>
//                 <Route path='/dashboard' element={<Dashboard />}>
//                     <Route path='home' element={<DashboardOverviewTab />} />
//                     <Route path='registrations' element={<RegistrationRequestTab />} />
//                 </Route>
//                 <Route path='*' element={<NotFound />}></Route>
//             </Routes>
//         </BrowserRouter>
//     </div>
// )

export default App;
