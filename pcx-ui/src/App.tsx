import "./App.css"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./app/components/layouts/Layout";
import HomePage from "./app/pages/HomePage";
import UnauthorizedPage from "./app/pages/UnauthorizedPage";
import LoginPage from "./app/pages/LoginPage";
import AuthDialog from "./app/pages/AuthDialog.tsx";
import RequireUser from "./app/components/RequireUser";
import {useAuthorizeQuery} from "./features/api/authApi";
import FilterPage from "./app/pages/CardList.tsx";
import {FilterType} from "./features/enums";
import PostServicePage from "./app/components/services/PostServicePage";
import PostProjectPage from "./app/components/projects/PostProjectPage";
import ProjectPage from "./app/components/projects/ProjectPage";
import Layout2 from "./app/components/layouts/Layout2";
import ApplyForProjectPage from "./app/components/projects/ApplyForProjectPage";
import ServiceLayout from "./app/components/layouts/ServiceLayout.tsx";
import ServicePage from "./app/components/services/ServicePage";
import BidPage from "./app/components/bids/BidPage";
import VerificationPage from "./app/pages/VerificationPage.tsx";
import TestPage from "./app/pages/TestPage.tsx";
import OrderPage from "./app/pages/OrderPage.tsx";
import ServicesFilter from "./app/components/services/ServicesFilter.tsx";
import NotFound from "./app/components/NotFound.tsx";
import LayoutWithTitle from "./app/components/layouts/LayoutWithTitle.tsx";
import {GlobalLoadingBackdrop} from "./app/components/GlobalLoadingBackdrop.tsx";
import {useGetCurrentUserQuery} from "./features/api/pcxApi.ts";

const App = () => {

    useGetCurrentUserQuery();

    return (
        <div className="App">
            <BrowserRouter>
                <GlobalLoadingBackdrop />
                <Routes>
                    <Route path='/' element={<Layout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path='projects' element={<FilterPage type={FilterType.PROJETCS}/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
                            <Route path='projects/add' element={<PostProjectPage/>}/>
                        </Route>
                        <Route path='test' element={<TestPage/>}/>
                        <Route path='freelancers' element={<FilterPage type={FilterType.FREELANCERS}/>}/>
                        <Route path='services' element={<ServicesFilter/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
                            <Route path='services/add' element={<PostServicePage/>}/>
                        </Route>
                        <Route path='unauthorized' element={<UnauthorizedPage/>}/>
                    </Route>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='signup' element={<AuthDialog/>}/>
                    <Route path='/' element={<LayoutWithTitle />}>
                        <Route path='verification' element={<VerificationPage/>}/>
                    </Route>
                    <Route path='/' element={<Layout2/>}>
                        <Route path='project/:id' element={<ProjectPage/>}/>
                        <Route element={<RequireUser allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}/>}>
                            <Route path='project/:id/apply' element={<ApplyForProjectPage/>}/>
                        </Route>
                        <Route element={<RequireUser allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}/>}>
                            <Route path='project/:id/amend' element={<ApplyForProjectPage/>}/>
                            <Route path='project/:id/bids' element={<FilterPage type={FilterType.BIDS}/>}/>
                        </Route>
                        <Route path='project/:projectId/bids/:id' element={<BidPage/>}/>
                    </Route>
                    <Route path='/' element={<ServiceLayout/>}>
                        <Route path='service/:id' element={<ServicePage/>}/>
                        <Route path='order/:id' element={<OrderPage/>}/>
                    </Route>
                    <Route path='*' element={<NotFound />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
