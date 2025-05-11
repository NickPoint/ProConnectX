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
import {ProfileStatus, ProfileType, useGetCurrentUserQuery} from "./features/api/pcxApi.ts";
import Dashboard from "./app/pages/Dashboard.tsx";
import DashboardOverviewTab from "./app/components/dashboard/DashboardOverviewTab.tsx";
import RegistrationRequestTab from "./app/components/dashboard/RegistrationRequestTab.tsx";
import UnauthorizedPage from "./app/pages/UnauthorizedPage.tsx";
import AuthPage from "./app/pages/AuthPage.tsx";
import ClientVerificationPage from "./app/pages/ClientVerificationPage.tsx";
import OrdersTab from "./app/components/dashboard/OrdersTab.tsx";
import SettingsTab from "./app/components/dashboard/SettingsTab.tsx";
import HomePageLayout from "./app/components/layouts/HomePageLayout.tsx";
import ServicesTab from "./app/components/dashboard/ServicesTab.tsx";

const App = () => {

    const {data: user} = useGetCurrentUserQuery();

    return (
        <div className="App">
            <BrowserRouter>
                <GlobalLoadingBackdrop />
                <Routes>
                    <Route path='/' element={<HomePageLayout/>}>
                        <Route index element={<HomePage/>}/>
                    </Route>
                    <Route path='/' element={<Layout />}>
                        {/*<Route path='projects' element={<FilterPage type={FilterType.PROJETCS}/>}/>*/}
                        {/*<Route element={<RequireUser allowedProfiles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>*/}
                        {/*    <Route path='projects/add' element={<PostProjectPage/>}/>*/}
                        {/*</Route>*/}
                        {/*TODO: <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>*/}
                        <Route path='auth' element={<AuthPage />}/>
                        <Route path='freelancer-verification' element={
                            <RequireUser allowedProfiles={[ProfileType.Freelancer, ProfileType.Admin]}
                                         disallowedStatuses={[{type: ProfileType.Freelancer, status: ProfileStatus.Pending}]}>
                                <FreelancerVerificationPage/>
                            </RequireUser>}/>
                        <Route path='client-verification' element={
                            <RequireUser allowedProfiles={[ProfileType.Client, ProfileType.Admin]}
                                         disallowedStatuses={[{type: ProfileType.Client, status: ProfileStatus.Pending}]}>
                                <ClientVerificationPage/>
                            </RequireUser>}/>
                        <Route path='service/add' element={
                            <RequireUser allowedProfiles={[ProfileType.Freelancer, ProfileType.Admin]}>
                                <PostServicePage/>
                            </RequireUser>}/>
                        <Route path='services' element={<ServicesFilter/>}/>
                    </Route>
                    <Route path='/' element={<LayoutWithTitle/>}>
                        <Route path='unauthorized' element={<UnauthorizedPage />} />
                    </Route>
                    {/*<Route path='/' element={<Layout2/>}>*/}
                    {/*    <Route path='project/:id' element={<ProjectPage/>}/>*/}
                    {/*    <Route element={<RequireUser allowedProfiles={[R, 'ROLE_ADMIN']}/>}>*/}
                    {/*        <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>*/}
                    {/*    </Route>*/}
                    {/*    <Route element={<RequireUser allowedProfiles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>*/}
                    {/*        <Route path='project/:id/amend' element={<ApplyForProjectPage/>}/>*/}
                    {/*        <Route path='project/:id/bids' element={<FilterPage type={FilterType.BIDS}/>}/>*/}
                    {/*    </Route>*/}
                    {/*    <Route path='project/:projectId/bids/:id' element={<BidPage/>}/>*/}
                    {/*</Route>*/}
                    <Route path='/' element={<ServiceLayout/>}>
                        <Route path='service/:id' element={<ServicePage/>}/>
                    </Route>
                    <Route path='/dashboard' element={<RequireUser allowedProfiles={[ProfileType.Freelancer, ProfileType.Admin, ProfileType.Client]}>
                        <Dashboard />
                    </RequireUser>}>
                        <Route path='home' element={<DashboardOverviewTab />} />
                        <Route path='registrations' element={<RegistrationRequestTab />} />
                        <Route path='services' element={<ServicesTab />} />
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
//                     <Route element={<RequireUser allowedProfiles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
//                         <Route path='projects/add' element={<PostProjectPage/>}/>
//                     </Route>
//                     <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>
//                     <Route path='services' element={<ServicesFilter/>}/>
//                     <Route element={<RequireUser allowedProfiles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
//                         <Route path='services/add' element={<PostServicePage/>}/>
//                     </Route>
//                 </Route>
//                 <Route path='login' element={<LoginPage/>}/>
//                 <Route path='signup' element={<AuthDialog/>}/>
//                 <Route element={<RequireUser allowedProfiles={['ROLE_UNVERIFI', 'ROLE_ADMIN']}/>}/>
//                 <Route path='/' element={<LayoutWithTitle />}>
//                     <Route path='verification' element={<VerificationPage/>}/>
//                 </Route>
//                 <Route path='/' element={<Layout2/>}>
//                     <Route path='project/:id' element={<ProjectPage/>}/>
//                     <Route element={<RequireUser allowedProfiles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
//                         <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>
//                     </Route>
//                     <Route element={<RequireUser allowedProfiles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
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
